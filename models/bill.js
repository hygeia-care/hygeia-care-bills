const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    total: {
        type: Number,
        required: true
    },

    services: {
        type: String,
        required: true
    },

    issueDate: {
        type: Date,
        required: true
    },

    patient: {
        type: String,
        required: true
    },

    appointment: {
        type: String,
        required: true
    }    

});

billSchema.methods.cleanup = function() {
    return {
        name: this.name,
        description: this.description,
        total: this.total,
        services: this.services,
        issueDate: this.expiredDate,
        patient: this.patient,
        appointment: this.appointment
    }
}

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;