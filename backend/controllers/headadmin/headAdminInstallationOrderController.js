import InstallationOrder from '../../models/InstallationOrder.js';
import OrgUser from '../../models/OrgUser.js';
import OrgTechnician from '../../models/OrgTechnician.js';
import Plan from '../../models/Plan.js';

/* =====================================================
   GET INSTALLATION ORDERS (HEAD ADMIN)
   CONDITIONS:
   - Org scoped
   - stages.payment_received === true
   - stages.kyc_verified === true
   - Resolve customer_name from OrgUser
   - Resolve plan_name from Plan
   - Expose payment_received for frontend
===================================================== */
export const getInstallationOrders = async (req, res) => {
  try {
    const org_id = req.user.organization;

    /* =========================
       1. FETCH ELIGIBLE ORDERS
    ========================= */
    const orders = await InstallationOrder.find({
      org_id,
      'stages.payment_received': true,
      'stages.kyc_verified': true,
    })
      .sort({ createdAt: -1 })
      .lean();

    /* =========================
       2. FETCH CUSTOMERS
    ========================= */
    const users = await OrgUser.find({ org_id })
      .select('user_id user_name')
      .lean();

    /* =========================
       3. FETCH PLANS
    ========================= */
    const plans = await Plan.find({ org_id })
      .select('plan_id name')
      .lean();

    /* =========================
       4. BUILD USER MAP
    ========================= */
    const userMap = {};
    users.forEach((u) => {
      userMap[u.user_id] =
        `${u.user_name?.first_name || ''} ${u.user_name?.last_name || ''}`.trim();
    });

    /* =========================
       5. BUILD PLAN MAP
    ========================= */
    const planMap = {};
    plans.forEach((p) => {
      planMap[p.plan_id] = p.name;
    });

    /* =========================
       6. ENRICH ORDERS
    ========================= */
    const enrichedOrders = orders.map((order) => ({
      ...order,

      // ✅ Source of truth
      payment_received: order.stages?.payment_received === true,

      // UI helpers
      customer_name: userMap[order.user_id] || 'Unknown Customer',
      plan_name: planMap[order.plan_id] || 'Unknown Plan',
    }));

    res.status(200).json(enrichedOrders);
  } catch (error) {
    console.error('🔥 getInstallationOrders:', error);
    res.status(500).json({
      message: 'Failed to fetch installation orders',
    });
  }
};

/* =====================================================
   ASSIGN TECHNICIAN TO INSTALLATION ORDER
   CONDITIONS:
   - Order must be OPEN
   - Technician must:
       • belong to same org
       • be ACTIVE
       • be FREE
   - Technician becomes BUSY
===================================================== */
export const assignInstallationTechnician = async (req, res) => {
  try {
    const org_id = req.user.organization;
    const { technician_id } = req.body;

    if (!technician_id) {
      return res.status(400).json({
        message: 'technician_id is required',
      });
    }

    /* =========================
       1. VERIFY TECHNICIAN
    ========================= */
    const technician = await OrgTechnician.findOne({
      _id: technician_id,
      org_id,
      is_active: true,
      work_status: 'free', // ✅ FIXED
    });

    if (!technician) {
      return res.status(400).json({
        message: 'Technician is not available',
      });
    }

    /* =========================
       2. ASSIGN ORDER
    ========================= */
    const order = await InstallationOrder.findOneAndUpdate(
      {
        _id: req.params.id,
        org_id,
        status: 'open',
      },
      {
        technician_id,
        status: 'assigned',
        'stages.technician_assigned': true,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: 'Order not found or already assigned',
      });
    }

    /* =========================
       3. MARK TECHNICIAN BUSY
    ========================= */
    technician.work_status = 'busy';
    await technician.save();

    res.status(200).json({
      message: 'Technician assigned successfully',
      order,
    });
  } catch (error) {
    console.error('🔥 assignInstallationTechnician:', error);
    res.status(500).json({
      message: 'Failed to assign technician',
    });
  }
};

/* =====================================================
   COMPLETE INSTALLATION
   CONDITIONS:
   - Order must be ASSIGNED
   - Technician is released (busy → free)
===================================================== */
export const completeInstallation = async (req, res) => {
  try {
    const org_id = req.user.organization;
    const { id } = req.params;

    /* =========================
       1. FIND ORDER
    ========================= */
    const order = await InstallationOrder.findOne({
      _id: id,
      org_id,
      status: 'assigned',
    });

    if (!order) {
      return res.status(404).json({
        message: 'Order not found or not in assigned state',
      });
    }

    /* =========================
       2. COMPLETE ORDER
    ========================= */
    order.status = 'completed';
    order.stages.installation_completed = true;
    await order.save();

    /* =========================
       3. RELEASE TECHNICIAN
    ========================= */
    if (order.technician_id) {
      await OrgTechnician.findByIdAndUpdate(order.technician_id, {
        work_status: 'free',
      });
    }

    res.status(200).json({
      message: 'Installation completed successfully',
    });
  } catch (error) {
    console.error('🔥 completeInstallation:', error);
    res.status(500).json({
      message: 'Failed to complete installation',
    });
  }
};
