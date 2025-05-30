"use client"
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from 'react-hook-form';

const ContactUs = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm({
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      }
    });
  
    const onSubmit = async (data:string) => {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', data);
      setIsSubmitted(true);
      setIsSubmitting(false);
      reset();
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    };
  
    const contactInfo = [
      {
        icon: <Mail className="h-6 w-6" />,
        title: "Email Us",
        details: "support@e-orion.com",
        description: "Get in touch for general inquiries"
      },
      {
        icon: <Phone className="h-6 w-6" />,
        title: "Call Us",
        details: "+1 (555) 123-4567",
        description: "Mon-Fri 9AM-6PM PST"
      },
      {
        icon: <MessageSquare className="h-6 w-6" />,
        title: "Live Chat",
        details: "Available 24/7",
        description: "Instant support for urgent issues"
      },
      {
        icon: <MapPin className="h-6 w-6" />,
        title: "Visit Us",
        details: "San Francisco, CA",
        description: "Schedule a meeting with our team"
      }
    ];
  
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <p className="inline-block text-sm font-medium bg-primary/10 text-secondary-foreground px-4 py-1.5 rounded-full mb-6">
                Get In Touch
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Contact <span className="text-primary">Our Team</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Have questions about E-ORION? We're here to help you get started with professional esports broadcasting.
              </p>
            </div>
          </div>
          
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-[100px]"></div>
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-blue-500/5 blur-[80px]"></div>
          </div>
        </section>
  
        {/* Contact Info & Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Whether you're planning your first tournament or running a major esports event, 
                  our team is ready to help you succeed.
                </p>
  
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-xl border border-border/50 /50">
                      <div className="flex-shrink-0 p-2 rounded-lg  text-primary">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-primary font-medium mb-1">{info.details}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Contact Form */}
              <div className="relative">
                <div className="border border-border/50 rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                  
                  {isSubmitted && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800 text-sm">Message sent successfully! We'll get back to you soon.</p>
                    </div>
                  )}
  
                  <form  className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name *</label>
                        <input
                          {...register('firstName', { 
                            required: 'First name is required',
                            minLength: { value: 2, message: 'First name must be at least 2 characters' }
                          })}
                          className="w-full px-4 py-3 rounded-lg border border-border  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name *</label>
                        <input
                          {...register('lastName', { 
                            required: 'Last name is required',
                            minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                          })}
                          className="w-full px-4 py-3 rounded-lg border border-border  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
  
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-border  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="john.doe@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
  
                    {/* Company */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Company/Organization</label>
                      <input
                        {...register('company')}
                        className="w-full px-4 py-3 rounded-lg border border-border  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Your company name"
                      />
                    </div>
  
                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                      <select
                        {...register('inquiryType')}
                        className="w-full px-4 py-3 rounded-lg border border-border  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="sales">Sales & Pricing</option>
                        <option value="partnership">Partnership</option>
                        <option value="media">Media & Press</option>
                      </select>
                    </div>
  
                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject *</label>
                      <input
                        {...register('subject', { 
                          required: 'Subject is required',
                          minLength: { value: 5, message: 'Subject must be at least 5 characters' }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-border  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="How can we help you?"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                      )}
                    </div>
  
                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <textarea
                        {...register('message', { 
                          required: 'Message is required',
                          minLength: { value: 10, message: 'Message must be at least 10 characters' }
                        })}
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-border  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-vertical"
                        placeholder="Tell us more about your needs..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>
  
                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg px-6 py-3 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  export default ContactUs