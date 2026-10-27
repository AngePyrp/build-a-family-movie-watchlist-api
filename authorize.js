export function authorizeModification(req, res, next) {
  const requestedUserId = Number(req.params.userId);
  if (req.user?.role !== "parent" && requestedUserId !== Number(req.user?.id)) {
    return res.status(403).json({ error: "Access denied" });
  }
  return next();
}
