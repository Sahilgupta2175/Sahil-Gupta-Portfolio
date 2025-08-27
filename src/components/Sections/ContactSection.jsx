import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Linkedin, Github, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { sendEmailWithAutoReply, validateEmailConfig } from "../../utils/emailjs";

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: null,
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formValues = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    // Debug: Log form values to console
    console.log('Form Values being sent:', formValues);

    try {
      // Validate EmailJS configuration
      if (!validateEmailConfig()) {
        throw new Error('Email service is not properly configured.');
      }

      // Send email with auto-reply using EmailJS
      const result = await sendEmailWithAutoReply(formValues);
      
      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message,
        });
        
        if (form) {
          form.reset();
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Email sending error:", error);
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (submitStatus.type) {
      const timer = setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <span>📬 Get In Touch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">Let's Build Something Amazing Together</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Whether you have a project in mind, want to collaborate, or just want to say hello, I'd love to hear from
            you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Contact Information</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm sm:text-base">Email</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm break-all">guptasahil2175@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm sm:text-base">Phone</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">+91 9956564108</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm sm:text-base">Location</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Orai, Uttar Pradesh, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Send me a message</h3>

            {submitStatus.type && (
              <div
                className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg flex items-start space-x-3 ${
                  submitStatus.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-xs sm:text-sm leading-relaxed">{submitStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  disabled={isSubmitting}
                  placeholder="Tell me about your project or just say hello!"
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
                ></textarea>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed py-3 sm:py-4 text-sm sm:text-base font-medium touch-friendly"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Mail className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
