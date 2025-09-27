import { Request, Response } from 'express';
import { Plot, Crop, CropLifecycle, Expense, Fertilizer, Pesticide, Irrigation } from '../models';
import { Op, fn, col, literal } from 'sequelize';

export class ReportsController {
  // Get financial overview data
  static async getFinancialOverview(req: Request, res: Response) {
    try {
      const { timeframe = 'month', plot_id } = req.query;
      
      // Calculate date range based on timeframe
      const now = new Date();
      let startDate: Date;
      
      if (timeframe === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const whereClause: any = {
        date: {
          [Op.gte]: startDate,
          [Op.lte]: now
        }
      };

      if (plot_id) {
        whereClause.plot_id = plot_id;
      }

      // Get total expenses
      const totalExpenses = await Expense.sum('amount', {
        where: whereClause
      }) || 0;

      // Get revenue from yield (simplified calculation)
      const yieldData = await CropLifecycle.findAll({
        where: {
          ...whereClause,
          event_type: 'harvest',
          yield_amount: { [Op.not]: null }
        },
        attributes: [
          [fn('SUM', col('yield_amount')), 'totalYield']
        ]
      });

      // Simplified revenue calculation (assuming $2 per kg)
      const totalRevenue = (yieldData[0]?.get('totalYield') as number || 0) * 2;
      const netProfit = totalRevenue - totalExpenses;

      // Get monthly breakdown
      const monthlyData = await Expense.findAll({
        where: whereClause,
        attributes: [
          [fn('DATE_TRUNC', 'month', col('date')), 'month'],
          [fn('SUM', col('amount')), 'totalExpenses']
        ],
        group: [fn('DATE_TRUNC', 'month', col('date'))],
        order: [[fn('DATE_TRUNC', 'month', col('date')), 'ASC']]
      });

      // Mock revenue data for monthly breakdown (in real app, this would come from sales data)
      const monthlyBreakdown = [
        { month: 'Jan', expenses: -2400, revenue: 4800, profit: 2400 },
        { month: 'Feb', expenses: -1800, revenue: 3600, profit: 1800 },
        { month: 'Mar', expenses: -3200, revenue: 6400, profit: 3200 },
        { month: 'Apr', expenses: -2800, revenue: 5600, profit: 2800 }
      ];

      res.json({
        success: true,
        data: {
          summary: {
            totalRevenue,
            totalExpenses,
            netProfit,
            revenueChange: '+12%',
            expensesChange: '-5%',
            profitChange: '+18%'
          },
          monthlyBreakdown
        }
      });
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch financial overview',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get crop yield analysis
  static async getCropYieldAnalysis(req: Request, res: Response) {
    try {
      const { plot_id } = req.query;

      const whereClause: any = {};
      if (plot_id) {
        whereClause.id = plot_id;
      }

      // Get plots with their crops and yield data
      const plots = await Plot.findAll({
        where: whereClause,
        include: [
          {
            model: Crop,
            as: 'current_crop',
            attributes: ['id', 'name', 'variety']
          },
          {
            model: CropLifecycle,
            as: 'lifecycles',
            where: {
              event_type: 'harvest',
              yield_amount: { [Op.not]: null }
            },
            required: false,
            attributes: ['yield_amount', 'yield_unit', 'date']
          }
        ]
      });

      // Mock crop performance data (in real app, calculate from actual yield data)
      const cropPerformance = [
        {
          crop: 'Wheat',
          acreage: 15.2,
          yieldPercentage: 85,
          target: 90,
          status: 'below_target'
        },
        {
          crop: 'Corn',
          acreage: 12.8,
          yieldPercentage: 92,
          target: 85,
          status: 'above_target'
        },
        {
          crop: 'Tomatoes',
          acreage: 8.5,
          yieldPercentage: 78,
          target: 80,
          status: 'below_target'
        }
      ];

      res.json({
        success: true,
        data: {
          cropPerformance,
          plotsData: plots
        }
      });
    } catch (error) {
      console.error('Error fetching crop yield analysis:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch crop yield analysis',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get resource efficiency data
  static async getResourceEfficiency(req: Request, res: Response) {
    try {
      const { timeframe = 'month', plot_id } = req.query;
      
      const now = new Date();
      let startDate: Date;
      
      if (timeframe === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const whereClause: any = {
        date: {
          [Op.gte]: startDate,
          [Op.lte]: now
        }
      };

      if (plot_id) {
        whereClause.plot_id = plot_id;
      }

      // Get water usage data
      const waterUsage = await Irrigation.sum('quantity', {
        where: whereClause
      }) || 0;

      // Get fertilizer usage data
      const fertilizerUsage = await Fertilizer.sum('quantity', {
        where: whereClause
      }) || 0;

      // Get labor costs (from expenses)
      const laborCosts = await Expense.sum('amount', {
        where: {
          ...whereClause,
          type: 'labor'
        }
      }) || 0;

      // Mock efficiency metrics (in real app, calculate based on targets and historical data)
      const efficiencyMetrics = [
        {
          metric: 'Water Usage',
          status: '15% below target consumption',
          badge: 'Efficient',
          badgeColor: 'green'
        },
        {
          metric: 'Fertilizer Usage',
          status: 'Within recommended range',
          badge: 'Normal',
          badgeColor: 'gray'
        },
        {
          metric: 'Labor Efficiency',
          status: '20% improvement this quarter',
          badge: 'High',
          badgeColor: 'green'
        }
      ];

      res.json({
        success: true,
        data: {
          metrics: efficiencyMetrics,
          rawData: {
            waterUsage,
            fertilizerUsage,
            laborCosts
          }
        }
      });
    } catch (error) {
      console.error('Error fetching resource efficiency:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch resource efficiency data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get comprehensive dashboard data
  static async getDashboardData(req: Request, res: Response) {
    try {
      const { timeframe = 'month', plot_id } = req.query;

      // Get all report data in parallel
      const [financialData, yieldData, efficiencyData] = await Promise.all([
        ReportsController.getFinancialDataInternal(timeframe as string, plot_id as string),
        ReportsController.getCropYieldDataInternal(plot_id as string),
        ReportsController.getResourceEfficiencyDataInternal(timeframe as string, plot_id as string)
      ]);

      res.json({
        success: true,
        data: {
          financial: financialData,
          cropYield: yieldData,
          efficiency: efficiencyData
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Internal helper methods
  private static async getFinancialDataInternal(timeframe: string, plot_id?: string) {
    // Calculate date range based on timeframe
    const now = new Date();
    let startDate: Date;
    if (timeframe === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const whereClause: any = {
      date: {
        [Op.gte]: startDate,
        [Op.lte]: now
      }
    };
    if (plot_id) {
      whereClause.plot_id = plot_id;
    }

    // Totals
    const totalExpenses = (await Expense.sum('amount', { where: whereClause })) || 0;
    const yieldRows = await CropLifecycle.findAll({
      where: {
        ...whereClause,
        event_type: 'harvest',
        yield_amount: { [Op.not]: null }
      },
      attributes: [[fn('SUM', col('yield_amount')), 'totalYield']]
    });
    const totalYield = (yieldRows[0]?.get('totalYield') as number) || 0;
    const pricePerUnit = 2; // TODO: replace with real pricing when available
    const totalRevenue = totalYield * pricePerUnit;
    const netProfit = totalRevenue - totalExpenses;

    // Monthly breakdown (group expenses and yields by month)
    const expByMonth = await Expense.findAll({
      where: whereClause,
      attributes: [[fn('DATE_TRUNC', 'month', col('date')), 'month'], [fn('SUM', col('amount')), 'totalExpenses']],
      group: [fn('DATE_TRUNC', 'month', col('date'))],
      order: [[fn('DATE_TRUNC', 'month', col('date')), 'ASC']]
    });
    const yieldByMonth = await CropLifecycle.findAll({
      where: {
        ...whereClause,
        event_type: 'harvest',
        yield_amount: { [Op.not]: null }
      },
      attributes: [[fn('DATE_TRUNC', 'month', col('date')), 'month'], [fn('SUM', col('yield_amount')), 'totalYield']],
      group: [fn('DATE_TRUNC', 'month', col('date'))],
      order: [[fn('DATE_TRUNC', 'month', col('date')), 'ASC']]
    });

    // Index data by month ISO string
    const toKey = (d: Date) => new Date(d).toISOString().slice(0, 7); // YYYY-MM
    const monthName = (d: Date) => d.toLocaleString('en-US', { month: 'short' });

    const expMap = new Map<string, number>();
    expByMonth.forEach(r => {
      const m = (r.get('month') as Date);
      expMap.set(toKey(m), Number(r.get('totalExpenses')) || 0);
    });
    const yieldMap = new Map<string, number>();
    yieldByMonth.forEach(r => {
      const m = (r.get('month') as Date);
      yieldMap.set(toKey(m), (Number(r.get('totalYield')) || 0) * pricePerUnit);
    });

    // Build a sorted list of months present in either dataset within range
    const monthsSet = new Set<string>([...expMap.keys(), ...yieldMap.keys()]);
    const months = Array.from(monthsSet).sort();
    const monthlyBreakdown = months.map(key => {
      const [year, month] = key.split('-').map(n => parseInt(n, 10));
      const date = new Date(year, month - 1, 1);
      const expenses = -(expMap.get(key) || 0); // negative to show outflow
      const revenue = yieldMap.get(key) || 0;
      const profit = revenue + expenses; // expenses negative
      return { month: monthName(date), expenses, revenue, profit };
    });

    return {
      summary: {
        totalRevenue,
        totalExpenses,
        netProfit,
        revenueChange: '+0%', // TODO: compute vs previous period
        expensesChange: '+0%',
        profitChange: '+0%'
      },
      monthlyBreakdown
    };
  }

  private static async getCropYieldDataInternal(plot_id?: string) {
    return {
      cropPerformance: [
        { crop: 'Wheat', acreage: 15.2, yieldPercentage: 85, target: 90, status: 'below_target' },
        { crop: 'Corn', acreage: 12.8, yieldPercentage: 92, target: 85, status: 'above_target' },
        { crop: 'Tomatoes', acreage: 8.5, yieldPercentage: 78, target: 80, status: 'below_target' }
      ]
    };
  }

  private static async getResourceEfficiencyDataInternal(timeframe: string, plot_id?: string) {
    return {
      metrics: [
        { metric: 'Water Usage', status: '15% below target consumption', badge: 'Efficient', badgeColor: 'green' },
        { metric: 'Fertilizer Usage', status: 'Within recommended range', badge: 'Normal', badgeColor: 'gray' },
        { metric: 'Labor Efficiency', status: '20% improvement this quarter', badge: 'High', badgeColor: 'green' }
      ]
    };
  }
}
