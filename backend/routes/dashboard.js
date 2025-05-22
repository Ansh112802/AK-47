import express from 'express';
import Purchase from '../models/Purchase.js';
import Transfer from '../models/Transfer.js';
import Assignment from '../models/Assignment.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let { base, assetType, date } = req.query;

    base = base && base !== 'All' ? base : null;
    assetType = assetType && assetType !== 'All' ? assetType : null;

    const purchaseFilter = {};
    const transfersInFilter = {};
    const transfersOutFilter = {};
    const assignmentFilter = {};

    if (date && date !== 'All') {
      const filterDate = new Date(date);
      const startOfDay = new Date(filterDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(filterDate);
      endOfDay.setHours(23, 59, 59, 999);

      purchaseFilter.date = { $gte: startOfDay, $lte: endOfDay };
      transfersInFilter.date = { $gte: startOfDay, $lte: endOfDay };
      transfersOutFilter.date = { $gte: startOfDay, $lte: endOfDay };
      assignmentFilter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (base) {
      purchaseFilter.base = base;
      transfersInFilter.toBase = base;
      transfersOutFilter.fromBase = base;
      assignmentFilter.base = base;
    }

    if (assetType) {
      purchaseFilter.assetType = assetType;
      transfersInFilter.assetType = assetType;
      transfersOutFilter.assetType = assetType;
      assignmentFilter.assetType = assetType;
    }

    // Aggregations
    const purchasesAgg = await Purchase.aggregate([
      { $match: purchaseFilter },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);
    const purchaseTotal = purchasesAgg[0]?.total || 0;

    const transfersInAgg = await Transfer.aggregate([
      { $match: transfersInFilter },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);
    const inTotal = transfersInAgg[0]?.total || 0;

    const transfersOutAgg = await Transfer.aggregate([
      { $match: transfersOutFilter },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);
    const outTotal = transfersOutAgg[0]?.total || 0;

    const assignmentsAgg = await Assignment.aggregate([
      { $match: assignmentFilter },
      {
        $group: {
          _id: '$type', // should be 'assigned' or 'expended'
          total: { $sum: '$quantity' },
        },
      },
    ]);

    console.log('Assignments Aggregation:', assignmentsAgg); // DEBUG

    const assigned = assignmentsAgg.find(a => a._id === 'assigned')?.total || 0;
    const expended = assignmentsAgg.find(a => a._id === 'expended')?.total || 0;

    // Details
    const purchasesDetails = await Purchase.find(purchaseFilter).sort({ date: -1 }).lean();
    const transfersInDetails = await Transfer.find(transfersInFilter).sort({ date: -1 }).lean();
    const transfersOutDetails = await Transfer.find(transfersOutFilter).sort({ date: -1 }).lean();

    const netMovement = purchaseTotal + inTotal - outTotal;

    const openingBalance = 1000; // Can be dynamic if needed
    const closingBalance = openingBalance + netMovement - assigned - expended;

    res.json({
      openingBalance,
      closingBalance,
      netMovement,
      assigned,
      expended,
      purchases: purchasesDetails,
      transferIn: transfersInDetails,
      transferOut: transfersOutDetails,
    });
  } catch (err) {
    console.error('Dashboard aggregation error:', err);
    res.status(500).json({ error: 'Dashboard aggregation failed' });
  }
});

export default router;
