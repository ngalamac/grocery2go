import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Check, CreditCard, MapPin, User, ShoppingBag, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdditionalItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCoupon } from '../context/CouponContext';
import { createOrder } from '../utils/orders';
import { paymentsApi } from '../services/api';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Badge from './ui/Badge';
import { cn } from '../utils/cn';

interface CheckoutPageProps {
  onBack: () => void;
  onSuccess: () => void;
  budget: number;
  additionalItems: AdditionalItem[];
  specialInstructions: string;
}

type CheckoutStep = 'info' | 'review' | 'payment';

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBack,
  onSuccess,
  budget,
  additionalItems,
  specialInstructions
}) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const { show } = useToast();
  const { applied } = useCoupon();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setOrderId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Yaoundé'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const MIN_SERVICE_FEE = 500;
  const subtotal = getCartTotal();
  const additionalItemsTotal = additionalItems.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const estimatedTotal = subtotal + additionalItemsTotal;

  const calculateServiceFee = () => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = estimatedTotal;
    let serviceFee = MIN_SERVICE_FEE;

    if (totalValue > 10000) {
      serviceFee += Math.floor((totalValue - 10000) / 5000) * 100;
    }

    if (itemCount > 10) {
      serviceFee += (itemCount - 10) * 50;
    }

    return Math.max(serviceFee, MIN_SERVICE_FEE);
  };

  const serviceFee = calculateServiceFee();
  const preDiscountTotal = estimatedTotal + serviceFee;
  const discount = applied ? (applied.type === 'percent' ? (preDiscountTotal * applied.value) / 100 : applied.value) : 0;
  const total = Math.max(0, preDiscountTotal - discount);

  const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
    { id: 'info', label: 'Information', icon: User },
    { id: 'review', label: 'Review Order', icon: ShoppingBag },
    { id: 'payment', label: 'Payment', icon: CreditCard }
  ];

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^(\+237)?[6][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Invalid Cameroon phone number';
    }
    if (!formData.address.trim()) errors.address = 'Address is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 'info') {
      if (!user) {
        openAuthModal();
        return;
      }
      if (validateForm()) {
        setCurrentStep('review');
      }
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'payment') setCurrentStep('review');
    else if (currentStep === 'review') setCurrentStep('info');
    else onBack();
  };

  const initializePayment = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    setIsProcessing(true);

    try {
      const newOrder = await createOrder({
        userId: user.id,
        items: cart,
        additionalItems,
        subtotal,
        shoppingFee: serviceFee,
        deliveryFee: 0,
        total,
        budget,
        specialInstructions,
        customerInfo: formData
      });
      const newOrderId = newOrder.id;
      setOrderId(newOrderId);

      // Start Monetbil payment on backend
      const startResp = await paymentsApi.startMonetbil({
        orderId: newOrderId,
        phone: formData.phone,
      });

      const paymentId: string | undefined = startResp.paymentId;
      if (!paymentId) {
        throw new Error('Failed to initialize Monetbil payment');
      }

      // Poll payment status until completion
      const pollIntervalMs = 3000;
      const maxAttempts = 60; // ~3 minutes
      let attempts = 0;

      const poll = async (): Promise<void> => {
        attempts += 1;
        try {
          const statusResp = await paymentsApi.checkMonetbil(newOrderId);
          const payment = statusResp.payment;
          if (payment?.status === 'success') {
            clearCart();
            show('Payment successful! Your order has been placed.', { type: 'success', title: 'Success' });
            setIsProcessing(false);
            onSuccess();
            return;
          }
          if (payment?.status === 'failed' || payment?.status === 'cancelled' || payment?.status === 'refunded') {
            show('Payment was not successful.', { type: 'error', title: 'Payment Failed' });
            setIsProcessing(false);
            return;
          }

          if (attempts < maxAttempts) {
            setTimeout(poll, pollIntervalMs);
          } else {
            show('Payment pending. You can track your order status.', { type: 'info' });
            setIsProcessing(false);
          }
        } catch (e) {
          if (attempts < maxAttempts) {
            setTimeout(poll, pollIntervalMs);
          } else {
            show('Unable to confirm payment at this time.', { type: 'warning' });
            setIsProcessing(false);
          }
        }
      };

      // Start polling
      setTimeout(poll, pollIntervalMs);
    } catch (error) {
      show('Failed to initialize payment. Please try again.', { type: 'error' });
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container-custom">
        <Button
          variant="ghost"
          onClick={handlePreviousStep}
          className="mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              const StepIcon = step.icon;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted ? '#7cb342' : isActive ? '#7cb342' : '#e5e5e5'
                      }}
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-md',
                        (isActive || isCompleted) ? 'text-white' : 'text-neutral-500'
                      )}
                    >
                      {isCompleted ? <Check size={24} /> : <StepIcon size={24} />}
                    </motion.div>
                    <span className={cn(
                      'text-sm font-medium text-center',
                      isActive ? 'text-primary-600' : 'text-neutral-600'
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-neutral-300 mx-4 mt-[-20px]">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: isCompleted ? '100%' : '0%' }}
                        className="h-full bg-primary-500"
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card>
                    <h2 className="text-2xl font-bold mb-6 font-display">Contact Information</h2>
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={formErrors.name}
                        placeholder="John Doe"
                        required
                      />
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={formErrors.email}
                        placeholder="john@example.com"
                        required
                      />
                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={formErrors.phone}
                        placeholder="+237 6XX XXX XXX"
                        helperText="We'll use this number for delivery updates"
                        required
                      />
                      <Input
                        label="Delivery Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        error={formErrors.address}
                        placeholder="Street address, building, floor"
                        required
                      />
                      <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        helperText="Delivery is only available in Yaoundé"
                        disabled
                      />

                      {specialInstructions && (
                        <Card className="bg-blue-50 border border-blue-200">
                          <div className="flex gap-3">
                            <MapPin className="text-blue-600 flex-shrink-0" size={20} />
                            <div>
                              <h3 className="font-semibold text-blue-900 mb-1">Shopping Instructions</h3>
                              <p className="text-sm text-blue-700">{specialInstructions}</p>
                            </div>
                          </div>
                        </Card>
                      )}

                      <Button onClick={handleNextStep} className="w-full" size="lg">
                        Continue to Review
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {currentStep === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card>
                    <h2 className="text-2xl font-bold mb-6 font-display">Review Your Order</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <User size={20} />
                          Delivery Information
                        </h3>
                        <div className="bg-neutral-50 rounded-lg p-4 space-y-2 text-sm">
                          <p><span className="font-medium">Name:</span> {formData.name}</p>
                          <p><span className="font-medium">Email:</span> {formData.email}</p>
                          <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                          <p><span className="font-medium">Address:</span> {formData.address}, {formData.city}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <ShoppingBag size={20} />
                          Order Items ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                        </h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {cart.map(item => (
                            <div key={item.id} className="flex gap-3 bg-neutral-50 rounded-lg p-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                                <p className="text-primary-600 font-bold mt-1">
                                  {(item.price * item.quantity).toFixed(0)} CFA
                                </p>
                              </div>
                            </div>
                          ))}

                          {additionalItems.length > 0 && (
                            <>
                              <div className="border-t pt-3">
                                <h4 className="font-semibold text-sm mb-2">Additional Items:</h4>
                                {additionalItems.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm py-1">
                                    <span>{item.name}</span>
                                    <span className="font-semibold">{item.estimatedPrice} CFA</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={handlePreviousStep} className="flex-1">
                          Edit Information
                        </Button>
                        <Button onClick={handleNextStep} className="flex-1">
                          Proceed to Payment
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card>
                    <h2 className="text-2xl font-bold mb-6 font-display">Payment Method</h2>

                    <div className="space-y-6">
                      <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Smartphone className="text-white" size={28} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">Mobile Money Payment</h3>
                            <p className="text-sm text-neutral-700 mb-3">
                              Pay securely with MTN Mobile Money or Orange Money via Campay
                            </p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Check size={16} className="text-primary-600" />
                                <span>Secure and encrypted payment</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Check size={16} className="text-primary-600" />
                                <span>Instant confirmation</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Check size={16} className="text-primary-600" />
                                <span>Multiple providers supported</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="bg-blue-50 border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-3">Budget Information</h3>
                        <div className="space-y-2 text-sm text-blue-800">
                          <div className="flex justify-between">
                            <span>Your Budget:</span>
                            <span className="font-bold">{budget.toFixed(0)} CFA</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Order Total:</span>
                            <span className="font-bold">{total.toFixed(0)} CFA</span>
                          </div>
                          <div className="flex justify-between text-primary-700">
                            <span>Remaining:</span>
                            <span className="font-bold">{(budget - total).toFixed(0)} CFA</span>
                          </div>
                          {applied && (
                            <p className="text-xs mt-2 pt-2 border-t border-blue-300">
                              Coupon <Badge variant="success" size="sm">{applied.code}</Badge> applied
                              (-{applied.type === 'percent' ? `${applied.value}%` : `${applied.value} CFA`})
                            </p>
                          )}
                        </div>
                      </Card>

                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> Any unused budget will be refunded after shopping is completed.
                          Payment is required before delivery.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Button
                          onClick={initializePayment}
                          loading={isProcessing}
                          className="w-full"
                          size="lg"
                        >
                          <CreditCard size={20} className="mr-2" />
                          pay with momo
                        </Button>
                        <Button variant="outline" onClick={handlePreviousStep} className="w-full">
                          Back to Review
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <Card className="lg:sticky top-24">
              <h3 className="text-xl font-bold mb-4 font-display">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Catalog Items:</span>
                  <span className="font-semibold">{subtotal.toFixed(0)} CFA</span>
                </div>
                {additionalItemsTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Additional Items:</span>
                    <span className="font-semibold">{additionalItemsTotal.toFixed(0)} CFA</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shopping & Delivery Fee:</span>
                  <span className="font-semibold">{serviceFee} CFA</span>
                </div>
                {applied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({applied.code}):</span>
                    <span className="font-semibold">- {discount.toFixed(0)} CFA</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">{total.toFixed(0)} CFA</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                  <ShoppingBag size={16} />
                  <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items in cart</span>
                </div>
                {budget > 0 && (
                  <div className="text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-600">Budget Progress:</span>
                      <span className="font-medium">{((total / budget) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((total / budget) * 100, 100)}%` }}
                        className="bg-primary-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
