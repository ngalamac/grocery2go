import React, { createContext, useContext, useMemo, useState } from 'react';

type Coupon = { code: string; type: 'percent' | 'fixed'; value: number };

type CouponContextType = {
  applied: Coupon | null;
  apply: (code: string) => boolean;
  clear: () => void;
};

const validCoupons: Record<string, Coupon> = {
  FLASH20: { code: 'FLASH20', type: 'percent', value: 20 },
  FREESHIP: { code: 'FREESHIP', type: 'fixed', value: 1000 },
};

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applied, setApplied] = useState<Coupon | null>(null);

  const apply = (code: string) => {
    const c = validCoupons[code.toUpperCase()];
    if (!c) return false;
    setApplied(c);
    return true;
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

