import {
  getAllCustomersService,
  getCustomerByIdService,
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
} from "./service.js";

// GET /api/customers
export const getCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const customers = await getAllCustomersService(search);
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/customers/:id
export const getCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerByIdService(id);
    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/customers
export const createCustomer = async (req, res, next) => {
  try {
    const { name, phone, email, address } = req.body;
    const customer = await createCustomerService({ name, phone, email, address });
    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/customers/:id
export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;
    const customer = await updateCustomerService(id, { name, phone, email, address });
    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteCustomerService(id);
    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

