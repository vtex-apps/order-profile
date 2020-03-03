import React, { useMemo, useContext } from 'react'

// eslint-disable-next-line
interface ProfileContext {}

const OrderProfileContext = React.createContext<ProfileContext | undefined>(
  undefined
)

const OrderProfile: React.FC = ({ children }) => {
  const value = useMemo(() => ({}), [])

  return (
    <OrderProfileContext.Provider value={value}>
      {children}
    </OrderProfileContext.Provider>
  )
}

export const useOrderProfile = () => {
  const context = useContext(OrderProfileContext)

  if (context == undefined) {
    throw new Error('useOrderProfile must be used within an <OrderProfile />')
  }

  return context
}

export default OrderProfile
