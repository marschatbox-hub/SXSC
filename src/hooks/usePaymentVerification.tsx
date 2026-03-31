import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { PaymentPinModal } from "@/components/PaymentPinModal";

export function usePaymentVerification() {
  const { profile } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

  const verifyPayment = (amount: number, onSuccess: () => void) => {
    if (!profile.hasPaymentPassword) {
      // No password set, proceed directly
      onSuccess();
      return;
    }

    if (profile.smallAmountPasswordFree && amount <= 100) {
      // Small amount password free enabled and amount <= 100
      onSuccess();
      return;
    }

    // Otherwise, show modal
    setPaymentAmount(amount);
    setOnSuccessCallback(() => onSuccess);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    if (onSuccessCallback) {
      onSuccessCallback();
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setOnSuccessCallback(null);
  };

  const PaymentModal = () => (
    <PaymentPinModal
      isOpen={isModalOpen}
      onClose={handleClose}
      onSuccess={handleSuccess}
      amount={paymentAmount}
    />
  );

  return { verifyPayment, PaymentModal };
}
