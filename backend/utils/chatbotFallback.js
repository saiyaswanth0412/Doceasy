class ChatbotFallback {
  constructor() {
    this.responses = {
      dermatologist_inquiry: {
        reply: 'We have experienced dermatologists available. Which dermatologist would you prefer, or would you like me to suggest one? Please confirm your preferred date and time slots (09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00).',
        suggestionMode: true
      },
      cardiologist_inquiry: {
        reply: 'Our cardiologists are ready to assist you. Do you have a preferred cardiologist in mind? Please let me know your preferred appointment date and time.',
        suggestionMode: true
      },
      neurologist_inquiry: {
        reply: 'We have qualified neurologists available. Would you like to book with a specific neurologist or shall I suggest one? Please provide your preferred date and available time slots.',
        suggestionMode: true
      },
      doctor_list_inquiry: {
        reply: 'We have doctors across multiple specializations including Cardiology, Neurology, Dermatology, and General Medicine. Which specialty interests you? Once you decide, please share your preferred date and time.',
        suggestionMode: false
      },
      availability_inquiry: {
        reply: 'We have appointments available throughout the week. Available time slots are: 09:00 AM, 10:00 AM, 11:00 AM, 2:00 PM, 3:00 PM, 4:00 PM, and 5:00 PM. What date and time suit you best?',
        suggestionMode: false
      },
      generic_response: {
        reply: 'I\'m here to help you book a medical appointment. Please tell me: What type of doctor do you need (e.g., Cardiologist, Dermatologist)? Once you decide, I\'ll guide you through selecting a doctor and appointment time.',
        suggestionMode: false
      }
    };
  }

  getResponse(message) {
    const normalized = message.toLowerCase();

    if (normalized.includes('derma') || normalized.includes('skin')) return this.responses.dermatologist_inquiry;
    if (normalized.includes('cardio') || normalized.includes('heart')) return this.responses.cardiologist_inquiry;
    if (normalized.includes('neuro') || normalized.includes('brain')) return this.responses.neurologist_inquiry;
    if (normalized.includes('doctor') || normalized.includes('specialist')) return this.responses.doctor_list_inquiry;
    if (normalized.includes('available') || normalized.includes('slot') || normalized.includes('time')) return this.responses.availability_inquiry;

    return this.responses.generic_response;
  }

  formatResponse(message) {
    const response = this.getResponse(message);
    return {
      success: true,
      reply: response.reply,
      bookingData: null,
      timestamp: new Date(),
      fallback: true,
      message: 'Using fallback response - API temporarily unavailable'
    };
  }
}

export default new ChatbotFallback();
