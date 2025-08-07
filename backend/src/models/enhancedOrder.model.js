import { model, Schema } from 'mongoose';
import { OrderStatus, OrderStatusFlow } from '../constants/orderStatus.js';
import { FoodModel } from './food.model.js';

export const LatLngSchema = new Schema(
  {
    lat: { type: String, required: true },
    lng: { type: String, required: true },
  },
  {
    _id: false,
  }
);

export const OrderItemSchema = new Schema(
  {
    food: { type: FoodModel.schema, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

OrderItemSchema.pre('validate', function (next) {
  this.price = this.food.price * this.quantity;
  next();
});

const TimelineEventSchema = new Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  message: { type: String },
  location: { type: LatLngSchema },
}, { _id: false });

const orderSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressLatLng: { type: LatLngSchema, required: true },
    paymentId: { type: String },
    totalPrice: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true },
    status: { type: String, default: OrderStatus.NEW },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    
    // Tracking information
    tracking: {
      estimatedDeliveryTime: { type: Date },
      deliveryPartner: { type: String },
      currentLocation: { type: LatLngSchema },
      deliveryNotes: { type: String },
    },
    
    // Order timeline
    timeline: [TimelineEventSchema],
    
    // Delivery information
    delivery: {
      driverName: { type: String },
      driverPhone: { type: String },
      vehicleNumber: { type: String },
      estimatedArrival: { type: Date },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Virtual for order progress
orderSchema.virtual('progress').get(function() {
  const currentIndex = OrderStatusFlow.indexOf(this.status);
  const totalSteps = OrderStatusFlow.length;
  return Math.round(((currentIndex + 1) / totalSteps) * 100);
});

// Virtual for time since order
orderSchema.virtual('timeSinceOrder').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for estimated remaining time
orderSchema.virtual('estimatedRemainingTime').get(function() {
  if (this.tracking.estimatedDeliveryTime) {
    return this.tracking.estimatedDeliveryTime.getTime() - Date.now();
  }
  return null;
});

// Method to add timeline event
orderSchema.methods.addTimelineEvent = function(status, message, location) {
  this.timeline.push({
    status,
    message,
    location,
  });
  this.status = status;
  return this.save();
};

// Method to update delivery location
orderSchema.methods.updateDeliveryLocation = function(lat, lng) {
  this.tracking.currentLocation = { lat, lng };
  return this.save();
};

export const EnhancedOrderModel = model('enhancedOrder', orderSchema);
