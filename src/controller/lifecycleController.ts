import { Request, Response } from 'express';
import { BaseController } from './basecontroller';
import { CropLifecycle, Plot, Crop } from '../models';
import { Op } from 'sequelize';

// Define lifecycle event types with Urdu translations
export const LIFECYCLE_EVENT_TYPES = {
  PLANTING: { en: 'Planting', ur: 'بوائی' },
  SEEDLING: { en: 'Seedling', ur: 'پودا' },
  VEGETATIVE: { en: 'Vegetative Growth', ur: 'نشوونما' },
  FLOWERING: { en: 'Flowering', ur: 'پھول' },
  FRUITING: { en: 'Fruiting', ur: 'پھل' },
  MATURATION: { en: 'Maturation', ur: 'پختگی' },
  HARVESTING: { en: 'Harvesting', ur: 'کٹائی' },
  POST_HARVEST: { en: 'Post Harvest', ur: 'کٹائی کے بعد' },
  DISEASE: { en: 'Disease Treatment', ur: 'بیماری کا علاج' },
  PEST_CONTROL: { en: 'Pest Control', ur: 'حشرات کا کنٹرول' },
  FERTILIZATION: { en: 'Fertilization', ur: 'کھاد ڈالنا' },
  IRRIGATION: { en: 'Irrigation', ur: 'آبپاشی' },
  WEEDING: { en: 'Weeding', ur: 'گھاس نکالنا' },
  PRUNING: { en: 'Pruning', ur: 'کانٹ چھانٹ' },
  OTHER: { en: 'Other', ur: 'دوسرا' }
};

// Helper function to determine plot status based on event type
function getPlotStatusFromEventType(eventType: string): string {
  const eventTypeUpper = eventType.toUpperCase();

  if (eventTypeUpper.includes('PLANTING') || eventTypeUpper.includes('SEEDLING')) {
    return 'planting';
  } else if (eventTypeUpper.includes('HARVESTING') || eventTypeUpper.includes('POST_HARVEST')) {
    return 'harvested';
  } else if (eventTypeUpper.includes('VEGETATIVE') || eventTypeUpper.includes('FLOWERING') ||
             eventTypeUpper.includes('FRUITING') || eventTypeUpper.includes('MATURATION') ||
             eventTypeUpper.includes('DISEASE') || eventTypeUpper.includes('PEST_CONTROL') ||
             eventTypeUpper.includes('FERTILIZATION') || eventTypeUpper.includes('IRRIGATION') ||
             eventTypeUpper.includes('WEEDING') || eventTypeUpper.includes('PRUNING')) {
    return 'growing';
  } else {
    return 'growing'; // Default to growing for other events
  }
}

// Helper function to update plot status based on latest lifecycle event
async function updatePlotStatusFromLifecycle(plotId: number) {
  try {
    // Find the latest lifecycle event for this plot
    const latestEvent = await CropLifecycle.findOne({
      where: { plot_id: plotId },
      order: [['date', 'DESC']],
      limit: 1
    });

    if (latestEvent) {
      const newStatus = getPlotStatusFromEventType(latestEvent.event_type);
      await Plot.update({ status: newStatus }, { where: { id: plotId } });
      console.log(`Updated plot ${plotId} status to ${newStatus} based on lifecycle event: ${latestEvent.event_type}`);
    }
  } catch (error) {
    console.error(`Error updating plot status for plot ${plotId}:`, error);
  }
}

export class LifecycleController extends BaseController {
  // Get all lifecycle events
  async getAllLifecycles(req: Request, res: Response) {
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
            attributes: ['id', 'name', 'name_urdu']
          }
        ],
        order: [['date', 'DESC']],
        limit: Number(limit),
        offset
      });

      this.success(
        req,
        res,
        this.status.OK,
        lifecycles.rows,
        "Lifecycle events retrieved successfully"
      );
    } catch (error) {
      console.error('Error fetching lifecycles:', error);
      this.handleServiceError(req, res, error, 'Failed to fetch lifecycle events');
    }
  }

  // Get lifecycle by ID
  async getLifecycleById(req: Request, res: Response) {
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
            attributes: ['id', 'name', 'name_urdu']
          }
        ]
      });

      if (!lifecycle) {
        return this.error(req, res, this.status.NOT_FOUND, 'Lifecycle event not found');
      }

      this.success(req, res, this.status.OK, lifecycle, "Lifecycle event retrieved successfully");
    } catch (error) {
      console.error('Error fetching lifecycle:', error);
      this.handleServiceError(req, res, error, 'Failed to fetch lifecycle event');
    }
  }

  // Create new lifecycle event
  async createLifecycle(req: Request, res: Response) {
    try {
      const {
        plot_id,
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
        return this.error(req, res, this.status.BAD_REQUEST, 'Missing required fields: plot_id, event_type, title, date');
      }

      // Verify plot exists
      const plot = await Plot.findByPk(plot_id);
      if (!plot) {
        return this.error(req, res, this.status.NOT_FOUND, 'Plot not found');
      }

      const lifecycle = await CropLifecycle.create({
        plot_id,
        event_type,
        title,
        description,
        date,
        notes,
        yield_amount,
        yield_unit
      });

      // Update plot status based on the new lifecycle event
      await updatePlotStatusFromLifecycle(plot_id);

      // Fetch the created lifecycle with associations
      const createdLifecycle = await CropLifecycle.findByPk(lifecycle.id, {
        include: [
          {
            model: Plot,
            as: 'plot',
            attributes: ['id', 'name', 'acreage']
          },
        ]
      });

      this.success(req, res, this.status.CREATED, createdLifecycle, 'Lifecycle event created successfully');
    } catch (error) {
      console.error('Error creating lifecycle:', error);
      this.handleServiceError(req, res, error, 'Failed to create lifecycle event');
    }
  }

  // Update lifecycle event
  async updateLifecycle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const lifecycle = await CropLifecycle.findByPk(id);
      if (!lifecycle) {
        return this.error(req, res, this.status.NOT_FOUND, 'Lifecycle event not found');
      }

      await lifecycle.update(updateData);

      // Update plot status based on the updated lifecycle event
      await updatePlotStatusFromLifecycle(lifecycle.plot_id);

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
            attributes: ['id', 'name', 'name_urdu']
          }
        ]
      });

      this.success(req, res, this.status.OK, updatedLifecycle, 'Lifecycle event updated successfully');
    } catch (error) {
      console.error('Error updating lifecycle:', error);
      this.handleServiceError(req, res, error, 'Failed to update lifecycle event');
    }
  }

  // Delete lifecycle event
  async deleteLifecycle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const lifecycle = await CropLifecycle.findByPk(id);
      if (!lifecycle) {
        return this.error(req, res, this.status.NOT_FOUND, 'Lifecycle event not found');
      }

      await lifecycle.destroy();

      this.success(req, res, this.status.OK, null, 'Lifecycle event deleted successfully');
    } catch (error) {
      console.error('Error deleting lifecycle:', error);
      this.handleServiceError(req, res, error, 'Failed to delete lifecycle event');
    }
  }

  // Get lifecycle events by plot
  async getLifecyclesByPlot(req: Request, res: Response) {
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
            attributes: ['id', 'name', 'name_urdu']
          }
        ],
        order: [['date', 'DESC']],
        limit: Number(limit),
        offset
      });

      this.success(req, res, this.status.OK, lifecycles.rows, 'Lifecycle events retrieved successfully');
    } catch (error) {
      console.error('Error fetching lifecycles by plot:', error);
      this.handleServiceError(req, res, error, 'Failed to fetch lifecycle events for plot');
    }
  }
}
