import React, { FC } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import {
  useOrderForm,
  useOrderQueue,
  useQueueStatus,
  OrderQueueProvider,
} from '@vtex/order-manager'

import { mockOrderForm } from '../__fixtures__/orderForm'
import { OrderFormProvider } from '../__fixtures__/OrderFormProvider'
import {
  createOrderProfileProvider,
  useOrderProfile,
} from '../components/createOrderProfileProvider'
import { LogParams } from '../utils/logger'

const mockProfileData = {
  firstName: 'Sicrano ',
  lastName: 'DiTal',
  phone: '+55(12) 3 1231-223',
  documentType: 'cpf',
  document: '123.456.789-09',
  email: 'fulano@detal.com',
}

const mockLog = jest.fn()

function useLogger() {
  const log = ({
    type,
    level,
    event,
    workflowType,
    workflowInstance,
  }: LogParams) => {
    mockLog({
      type,
      level,
      event,
      workflowType: workflowType ?? 'OrderProfileTest',
      workflowInstance,
    })
  }

  return { log }
}

const mockUpdateOrderFormProfile = jest.fn().mockResolvedValue(true)
const mockUpdateClientPreferencesData = jest.fn().mockResolvedValue(true)

const createWrapperOrderProviders = () => {
  const useUpdateOrderFormProfile = () => ({
    updateOrderFormProfile: mockUpdateOrderFormProfile,
  })

  const useUpdateClientPreferencesData = () => ({
    updateClientPreferencesData: mockUpdateClientPreferencesData,
  })

  const { OrderProfileProvider } = createOrderProfileProvider({
    useLogger,
    useOrderQueue,
    useOrderForm,
    useUpdateOrderFormProfile,
    useUpdateClientPreferencesData,
    useQueueStatus,
  })

  const Wrapper: FC = ({ children }) => {
    return (
      <OrderQueueProvider>
        <OrderFormProvider>
          <OrderProfileProvider>{children}</OrderProfileProvider>
        </OrderFormProvider>
      </OrderQueueProvider>
    )
  }

  return { Wrapper }
}

describe('OrderProfile', () => {
  afterEach(() => {
    mockUpdateOrderFormProfile.mockReset()
    mockUpdateClientPreferencesData.mockReset()
    mockLog.mockReset()
  })

  it('should throw an error if theres no OrderPaymentProvider on the tree', () => {
    const {
      result: { error },
    } = renderHook(() => useOrderProfile())

    expect(error).not.toBeNull()
    expect(error?.message).toEqual(
      'useOrderProfile must be used within an <OrderProfile />'
    )
    expect(mockUpdateOrderFormProfile).not.toHaveBeenCalled()
  })

  it('should get right client data from orderform context', () => {
    const { Wrapper } = createWrapperOrderProviders()
    const {
      result: { error, current },
    } = renderHook(() => useOrderProfile(), { wrapper: Wrapper })

    expect(error).toBeUndefined()
    expect(current.clientProfileData).toEqual(mockOrderForm.clientProfileData)
  })

  it('should call updateOrderFormProfile if setOrderProfile is executed', async () => {
    const { Wrapper } = createWrapperOrderProviders()
    const {
      result: {
        error,
        current: { setOrderProfile, clientProfileData },
      },
    } = renderHook(() => useOrderProfile(), { wrapper: Wrapper })

    mockUpdateOrderFormProfile.mockReturnValue({
      ...mockOrderForm,
      clientProfileData: {
        email: mockProfileData.email,
        firstName: mockProfileData.firstName,
        lastName: mockProfileData.lastName,
        isValid: true,
      },
    })

    expect(mockUpdateOrderFormProfile).not.toHaveBeenCalled()
    expect(error).toBeUndefined()
    expect(clientProfileData).toEqual(mockOrderForm.clientProfileData)
    await act(async () => {
      const { success } = await setOrderProfile(mockProfileData)

      expect(success).toBeTruthy()
    })
    expect(mockUpdateOrderFormProfile).toHaveBeenCalledWith(
      mockProfileData,
      mockOrderForm.id
    )
    expect(mockLog).not.toHaveBeenCalled()
  })

  it('should dispatch a log if something broken during the setOrderProfile execution', async () => {
    const { Wrapper } = createWrapperOrderProviders()
    const {
      result: {
        error,
        current: { setOrderProfile },
      },
    } = renderHook(() => useOrderProfile(), { wrapper: Wrapper })

    expect(mockUpdateOrderFormProfile).not.toHaveBeenCalled()
    mockUpdateOrderFormProfile.mockRejectedValue({ code: 'TASK_CANCELLED' })
    expect(error).toBeUndefined()
    await act(async () => {
      const { success } = await setOrderProfile(mockProfileData)

      expect(success).toBeFalsy()
    })
    expect(mockLog).toHaveBeenCalledWith({
      type: 'Error',
      level: 'Critical',
      event: {
        error: { code: 'TASK_CANCELLED' },
        orderFormId: mockOrderForm.id,
      },
      workflowInstance: 'client-profile-not-updated',
      workflowType: 'OrderProfileTest',
    })
  })

  it('should call updateClientPreferencesData when setClientPreferencesData is executed', async () => {
    const { Wrapper } = createWrapperOrderProviders()
    const {
      result: {
        error,
        current: { setClientPreferencesData, clientProfileData },
      },
    } = renderHook(() => useOrderProfile(), { wrapper: Wrapper })

    const mockPreferencesData = {
      optInNewsletter: false,
      locale: 'pt-br',
    }

    expect(mockUpdateClientPreferencesData).not.toHaveBeenCalled()
    expect(error).toBeUndefined()
    expect(clientProfileData).toEqual(mockOrderForm.clientProfileData)
    await act(async () => {
      const { success } = await setClientPreferencesData(mockPreferencesData)

      expect(success).toBeTruthy()
    })
    expect(mockUpdateClientPreferencesData).toHaveBeenCalledWith(
      mockPreferencesData,
      mockOrderForm.id
    )
    expect(mockLog).not.toHaveBeenCalled()
  })

  it('should dispatch a log if something broken during the setClientPreferencesData execution', async () => {
    const { Wrapper } = createWrapperOrderProviders()
    const {
      result: {
        error,
        current: { setClientPreferencesData, clientProfileData },
      },
    } = renderHook(() => useOrderProfile(), { wrapper: Wrapper })

    const mockPreferencesData = {
      optInNewsletter: false,
      locale: 'pt-br',
    }

    mockUpdateClientPreferencesData.mockRejectedValue({
      code: 'TASK_CANCELLED',
    })
    expect(mockUpdateClientPreferencesData).not.toHaveBeenCalled()
    expect(error).toBeUndefined()
    expect(clientProfileData).toEqual(mockOrderForm.clientProfileData)
    await act(async () => {
      const { success } = await setClientPreferencesData(mockPreferencesData)

      expect(success).toBeFalsy()
    })
    expect(mockUpdateClientPreferencesData).toHaveBeenCalledWith(
      mockPreferencesData,
      mockOrderForm.id
    )
    expect(mockLog).toHaveBeenCalledWith({
      type: 'Error',
      level: 'Critical',
      event: {
        error: {
          code: 'TASK_CANCELLED',
        },
        orderFormId: mockOrderForm.id,
      },
      workflowInstance: 'client-preferences-data-not-updated',
      workflowType: 'OrderProfileTest',
    })
  })
})
