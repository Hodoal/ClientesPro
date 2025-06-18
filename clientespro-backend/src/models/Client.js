const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del cliente es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email del cliente es requerido'],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ]
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true,
    maxlength: [15, 'El teléfono no puede exceder 15 caracteres']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'El nombre de la empresa no puede exceder 100 caracteres']
  },
  position: {
    type: String,
    trim: true,
    maxlength: [50, 'El cargo no puede exceder 50 caracteres']
  },
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [200, 'La dirección no puede exceder 200 caracteres']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, 'La ciudad no puede exceder 50 caracteres']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, 'El estado no puede exceder 50 caracteres']
    },
    zipCode: {
      type: String,
      trim: true,
      maxlength: [10, 'El código postal no puede exceder 10 caracteres']
    },
    country: {
      type: String,
      trim: true,
      maxlength: [50, 'El país no puede exceder 50 caracteres']
    }
  },
  socialMedia: {
    website: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    }
  },
  notes: {
    type: String,
    maxlength: [1000, 'Las notas no pueden exceder 1000 caracteres']
  },
  avatar: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Cada tag no puede exceder 30 caracteres']
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'prospect', 'customer'],
    default: 'prospect'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  lastContact: {
    type: Date,
    default: null
  },
  nextFollowUp: {
    type: Date,
    default: null
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para mejorar rendimiento
clientSchema.index({ owner: 1, isActive: 1 });
clientSchema.index({ email: 1, owner: 1 }, { unique: true });
clientSchema.index({ name: 'text', company: 'text', email: 'text' });

// Middleware para populate automático
clientSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'owner',
    select: 'name email'
  });
  next();
});

module.exports = mongoose.model('Client', clientSchema);