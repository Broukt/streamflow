// src/receiptModule/controllers/receiptController.js
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const prisma = require("../database/prisma");

const validStatuses = ["Pendiente", "Pagado", "Vencido"];

const createReceipt = catchAsync(async (req, res, next) => {
  const { userId, status, totalAmount } = req.body;

  if (!userId || !status || totalAmount == null) {
    return next(new AppError("All fields are required", 400));
  }
  if (totalAmount < 0) {
    return next(new AppError("Total amount must be positive", 400));
  }
  if (!validStatuses.includes(status)) {
    return next(
      new AppError("Status must be one of: Pendiente, Pagado, Vencido", 400)
    );
  }

  const receipt = await prisma.receipt.create({
    data: { userId, status, totalAmount },
  });

  res.status(201).json({ status: "success", data: receipt });
});

const getReceipt = catchAsync(async (req, res, next) => {
  const receipt = await prisma.receipt.findFirst({
    where: { id: req.params.id, isActive: true },
  });

  if (!receipt) {
    return next(new AppError("Receipt not found", 404));
  }

  res.status(200).json({ status: "success", data: receipt });
});

const updateReceiptStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new AppError("Status is required", 400));
  }
  if (!validStatuses.includes(status)) {
    return next(
      new AppError("Status must be one of: Pendiente, Pagado, Vencido", 400)
    );
  }

  const updated = await prisma.receipt.updateMany({
    where: { id: req.params.id, isActive: true },
    data: {
      status,
      paymentDate: status === "Pagado" ? new Date() : null,
    },
  });

  if (updated.count === 0) {
    return next(new AppError("Receipt not found or already deleted", 404));
  }

  const receipt = await prisma.receipt.findUnique({
    where: { id: req.params.id },
  });

  res.status(200).json({ status: "success", data: receipt });
});

const deleteReceipt = catchAsync(async (req, res, next) => {
  const receipt = await prisma.receipt.findUnique({
    where: { id: req.params.id },
  });

  if (!receipt || !receipt.isActive) {
    return next(new AppError("Receipt not found", 404));
  }
  if (receipt.status === "Pagado") {
    return next(new AppError("Cannot delete a paid receipt", 400));
  }

  await prisma.receipt.update({
    where: { id: req.params.id },
    data: { isActive: false },
  });

  res.status(204).send();
});

const getReceiptsByUserId = catchAsync(async (req, res, next) => {
  const { status } = req.query;
  const { userId } = req.params;

  console.log("User ID:", userId);
  console.log("Status filter:", status);

  // 1) Validar filtro de estado si se pasó
  if (status && !validStatuses.includes(status)) {
    return next(new AppError(
      `Invalid status filter: must be one of ${validStatuses.join(', ')}`,
      400
    ));
  }

  // 2) Obtener facturas activas del usuario (y opcionalmente por estado)
  const receipts = await prisma.receipt.findMany({
    where: {
      userId,
      isActive: true,
      ...(status ? { status } : {}),
    },
  });

  // 3) Si no hay resultados, devolver 404
  if (receipts.length === 0) {
    return next(new AppError(
      'No receipts found for this user',
      404
    ));
  }

  // 4) Responder con los datos y la cuenta
  res.status(200).json({
    status: 'success',
    results: receipts.length,
    data: receipts
  });
});

module.exports = {
  createReceipt,
  getReceipt,
  updateReceiptStatus,
  deleteReceipt,
  getReceiptsByUserId,
};
