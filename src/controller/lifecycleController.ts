import { Request, Response } from 'express';
import { CropLifecycle, Plot, Crop } from '../models';
import { Op } from 'sequelize';

export class LifecycleController {
  // Get all lifecycle events
  static async getAllLifecycles(req: Request, res: Response) {
    try {
      const { plot_id, crop_id, page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};
      if (plot_id) whereClause.plot_id = plot_id;
      if (crop_id) whereClause.crop_id = crop_id;

      const lifecycles = await CropLifecycle.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Plot,
            as: 'plot',
            attributes: ['id', 'name', 'acreage']
          },
          {
            model: Crop,
            as: 'crop',
            attributes: ['id', 'name', 'variety']
          }
        ],
        order: [['date', 'DESC']],
        limit: Number(limit),
        offset
      });

      res.json({
        success: true,
        data: lifecycles.rows,
        pagination: {
          total: lifecycles.count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(lifecycles.count / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching lifecycles:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch lifecycle events',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get lifecycle by ID
  static async getLifecycleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const lifecycle = await CropLifecycle.findByPk(id, {
        include: [
          {
            model: Plot,
            as: 'plot',
            attributes: ['id', 'name', 'acreage']
          },
          {
            model: Crop,
            as: 'crop',
            attributes: ['id', 'name', 'variety']
          }
        ]
      });

      if (!lifecycle) {
        return res.status(404).json({
          success: false,
          message: 'Lifecycle event not found'
        });
      }

      res.json({
        success: true,
        data: lifecycle
      });
    } catch (error) {
      console.error('Error fetching lifecycle:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch lifecycle event',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create new lifecycle event
  static async createLifecycle(req: Request, res: Response) {
    try {
      const {
        plot_id,
        crop_id,
        event_type,
        title,
        description,
        date,
        notes,
        yield_amount,
        yield_unit
      } = req.body;

      // Validate required fields
      if (!plot_id || !event_type || !title || !date) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: plot_id, event_type, title, date'
        });
      }

      // Verify plot exists
      const plot = await Plot.findByPk(plot_id);
      if (!plot) {
        return res.status(404).json({
          success: false,
          message: 'Plot not found'
        });
      }

      // Verify crop exists if provided
      if (crop_id) {
        const crop = await Crop.findByPk(crop_id);
        if (!crop) {
          return res.status(404).json({
            success: false,
            message: 'Crop not found'
          });
        }
      }

      const lifecycle = await CropLifecycle.create({
        plot_id,
        crop_id,
        event_type,
        title,
        description,
        date,
        notes,
        yield_amount,
        yield_unit
      });

      // Fetch the created lifecycle with associations
      const createdLifecycle = await CropLifecycle.findByPk(lifecycle.id, {
        include: [
          {
            model: Plot,
            as: 'plot',
            attributes: ['id', 'name', 'acreage']
          },
          {
            model: Crop,
            as: 'crop',
            attributes: ['id', 'name', 'variety']
          }
        ]
      });

      res.status(201).json({
        success: true,
        data: createdLifecycle,
        message: 'Lifecycle event created successfully'
      });
    } catch (error) {
      console.error('Error creating lifecycle:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create lifecycle event',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update lifecycle event
  static async updateLifecycle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const lifecycle = await CropLifecycle.findByPk(id);
      if (!lifecycle) {
        return res.status(404).json({
          success: false,
          message: 'Lifecycle event not found'
        });
      }

      await lifecycle.update(updateData);

      // Fetch updated lifecycle with associations
      const updatedLifecycle = await CropLifecycle.findByPk(id, {
        include: [
          {
            model: Plot,
            as: 'plot',
            attributes: ['id', 'name', 'acreage']
          },
          {
            model: Crop,
            as: 'crop',
            attributes: ['id', 'name', 'variety']
          }
        ]
      });

      res.json({
        success: true,
        data: updatedLifecycle,
        message: 'Lifecycle event updated successfully'
      });
    } catch (error) {
      console.error('Error updating lifecycle:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update lifecycle event',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete lifecycle event
  static async deleteLifecycle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const lifecycle = await CropLifecycle.findByPk(id);
      if (!lifecycle) {
        return res.status(404).json({
          success: false,
          message: 'Lifecycle event not found'
        });
      }

      await lifecycle.destroy();

      res.json({
        success: true,
        message: 'Lifecycle event deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting lifecycle:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete lifecycle event',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get lifecycle events by plot
  static async getLifecyclesByPlot(req: Request, res: Response) {
    try {
      const { plotId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const lifecycles = await CropLifecycle.findAndCountAll({
        where: { plot_id: plotId },
        include: [
          {
            model: Plot,
            as: 'plot',
            attributes: ['id', 'name', 'acreage']
          },
          {
            model: Crop,
            as: 'crop',
            attributes: ['id', 'name', 'variety']
          }
        ],
        order: [['date', 'DESC']],
        limit: Number(limit),
        offset
      });

      res.json({
        success: true,
        data: lifecycles.rows,
        pagination: {
          total: lifecycles.count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(lifecycles.count / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching lifecycles by plot:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch lifecycle events for plot',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
