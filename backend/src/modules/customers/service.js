import {
  selectAllCustomers,
  selectCustomerById,
  selectCustomerBills,
  selectCustomerByPhone,
  insertCustomer,
  updateCustomerQuery,
  deleteCustomerQuery,
} from "./query.js";
import { ApiError } from "../../utils/ApiError.js";

// Service: Get all customers
export const getAllCustomersService = async (search) => {
  return await selectAllCustomers(search);
};

// Service: Get customer by ID with purchase history
export const getCustomerByIdService = async (id) => {
  const customer = await selectCustomerById(id);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }
  const purchaseHistory = await selectCustomerBills(id);
  return {
    ...customer,
    bills: purchaseHistory,
  };
};

// Service: Create customer
export const createCustomerService = async ({ name, phone, email, address }) => {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Customer name is required");
  }

  const cleanPhone = phone ? phone.trim() : null;

  if (cleanPhone) {
    const existing = await selectCustomerByPhone(cleanPhone);
    if (existing) {
      throw new ApiError(409, `A customer with phone '${cleanPhone}' already exists`);
    }
  }

  const customerId = await insertCustomer({
    name: name.trim(),
    phone: cleanPhone,
    email: email ? email.trim().toLowerCase() : null,
    address: address ? address.trim() : null,
  });

  return await selectCustomerById(customerId);
};

// Service: Update customer
export const updateCustomerService = async (id, { name, phone, email, address }) => {
  const existing = await selectCustomerById(id);
  if (!existing) {
    throw new ApiError(404, "Customer not found");
  }

  const cleanName = name !== undefined ? name.trim() : existing.name;
  const cleanPhone = phone !== undefined ? (phone ? phone.trim() : null) : existing.phone;
  const cleanEmail = email !== undefined ? (email ? email.trim().toLowerCase() : null) : existing.email;
  const cleanAddress = address !== undefined ? (address ? address.trim() : null) : existing.address;

  if (!cleanName) {
    throw new ApiError(400, "Customer name cannot be empty");
  }

  if (cleanPhone && cleanPhone !== existing.phone) {
    const duplicate = await selectCustomerByPhone(cleanPhone);
    if (duplicate && duplicate.id !== Number(id)) {
      throw new ApiError(409, `A customer with phone '${cleanPhone}' already exists`);
    }
  }

  await updateCustomerQuery(id, {
    name: cleanName,
    phone: cleanPhone,
    email: cleanEmail,
    address: cleanAddress,
  });

  return await selectCustomerById(id);
};

// Service: Delete customer
export const deleteCustomerService = async (id) => {
  const existing = await selectCustomerById(id);
  if (!existing) {
    throw new ApiError(404, "Customer not found");
  }
  await deleteCustomerQuery(id);
  return true;
};

