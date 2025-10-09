import React, { createContext, useContext, useMemo, useState } from 'react';
import { couponsApi } from '../services/api';

type Coupon = { code: string; discount: number };

type CouponContextType = {
  applied: Coupon | null;
  apply: (code: string) => Promise<boolean>;
  clear: () => void;
};

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applied, setApplied] = useState<Coupon | null>(null);

  const apply = async (code: string): Promise<boolean> => {
    try {
      const coupon = await couponsApi.validate(code);
      setApplied(coupon);
      return true;
    } catch {
      return false;
    }
  };

  const clear = () => setApplied(null);

  const value = useMemo(() => ({ applied, apply, clear }), [applied]);
  return <CouponContext.Provider value={value}>{children}</CouponContext.Provider>;
};

export function useCoupon(): CouponContextType {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error('useCoupon must be used within CouponProvider');
  return ctx;
}
