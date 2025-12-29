import Plan from '../../models/Plan.js';
import ArchivedPlan from '../../models/ArchivedPlan.js';
import { ulid } from 'ulid'; // ✅ ULID PACKAGE

/* =========================
   CREATE PLAN
   HeadAdmin only
========================= */
export const createPlan = async (req, res) => {
  try {
    const {
      name,
      price,
      limit,
      validity,
      type,
    } = req.body;

    // 🔒 Basic validation
    if (!name || price == null || limit == null) {
      return res.status(400).json({
        message: 'Name, price and limit are required',
      });
    }

    const plan = await Plan.create({
      plan_id: ulid(), // 🔥 ULID GENERATED HERE
      org_id: req.user.organization,
      name: name.trim(),
      price: Number(price),
      limit: Number(limit),
      validity: validity || null,
      type: type || 'Standard',
      created_by: req.user.id,
      created_at: new Date(),
    });

    return res.status(201).json(plan);
  } catch (err) {
    console.error('❌ CREATE PLAN ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ACTIVE PLANS
   HeadAdmin + Admin
========================= */
export const getActivePlans = async (req, res) => {
  try {
    const plans = await Plan.find({
      org_id: req.user.organization,
    }).sort({ created_at: -1 });

    return res.status(200).json(plans);
  } catch (err) {
    console.error('❌ GET ACTIVE PLANS ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ARCHIVED PLANS
   HeadAdmin + Admin
========================= */
export const getArchivedPlans = async (req, res) => {
  try {
    const plans = await ArchivedPlan.find({
      org_id: req.user.organization,
    }).sort({ modified_at: -1 });

    return res.status(200).json(plans);
  } catch (err) {
    console.error('❌ GET ARCHIVED PLANS ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE PLAN
   → Archive old version
   → Update active plan
   HeadAdmin only
========================= */
export const updatePlan = async (req, res) => {
  try {
    const oldPlan = await Plan.findById(req.params.id);

    if (!oldPlan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // 1️⃣ ARCHIVE OLD PLAN
    await ArchivedPlan.create({
      plan_id: oldPlan.plan_id,
      org_id: oldPlan.org_id,
      name: oldPlan.name,
      price: oldPlan.price,
      limit: oldPlan.limit,
      validity: oldPlan.validity,
      type: oldPlan.type,
      action: 'edited',
      modified_by: req.user.id,
      modified_at: new Date(),
    });

    // 2️⃣ UPDATE ACTIVE PLAN
    oldPlan.name = req.body.name ?? oldPlan.name;
    oldPlan.price = req.body.price ?? oldPlan.price;
    oldPlan.limit = req.body.limit ?? oldPlan.limit;
    oldPlan.validity = req.body.validity ?? oldPlan.validity;
    oldPlan.type = req.body.type ?? oldPlan.type;

    await oldPlan.save();

    return res.status(200).json(oldPlan);
  } catch (err) {
    console.error('❌ UPDATE PLAN ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE PLAN
   → Archive
   → Remove active
   HeadAdmin only
========================= */
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // ARCHIVE BEFORE DELETE
    await ArchivedPlan.create({
      plan_id: plan.plan_id,
      org_id: plan.org_id,
      name: plan.name,
      price: plan.price,
      limit: plan.limit,
      validity: plan.validity,
      type: plan.type,
      action: 'deleted',
      modified_by: req.user.id,
      modified_at: new Date(),
    });

    await plan.deleteOne();

    return res.status(200).json({
      message: 'Plan deleted and archived successfully',
    });
  } catch (err) {
    console.error('❌ DELETE PLAN ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};
