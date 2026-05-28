const form = document.querySelector("#tenantForm");
const list = document.querySelector("#tenantList");
const emptyState = document.querySelector("#emptyState");
const totalCount = document.querySelector("#totalCount");
const paidCount = document.querySelector("#paidCount");
const clearAll = document.querySelector("#clearAll");

const fields = {
  name: document.querySelector("#tenantName"),
  rent: document.querySelector("#rentAmount"),
  deposit: document.querySelector("#depositAmount"),
  dueDate: document.querySelector("#dueDate"),
  note: document.querySelector("#damageNote"),
  paid: document.querySelector("#isPaid"),
};

let tenants = JSON.parse(localStorage.getItem("rental-manager-tenants") || "[]");

function saveTenants() {
  localStorage.setItem("rental-manager-tenants", JSON.stringify(tenants));
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  });
}

function renderTenants() {
  list.innerHTML = "";

  tenants.forEach((tenant) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${tenant.name}</td>
      <td>${formatMoney(tenant.rent)}</td>
      <td>${formatMoney(tenant.deposit)}</td>
      <td><span class="status ${tenant.paid ? "paid" : "unpaid"}">${tenant.paid ? "已缴" : "未缴"}</span></td>
      <td>${tenant.dueDate}</td>
      <td class="note">${tenant.note || "无"}</td>
      <td><button class="delete-btn" type="button" data-id="${tenant.id}">删除</button></td>
    `;
    list.appendChild(row);
  });

  const paidTotal = tenants.filter((tenant) => tenant.paid).length;
  totalCount.textContent = `${tenants.length} 位租客`;
  paidCount.textContent = `${paidTotal} 已缴租`;
  emptyState.classList.toggle("show", tenants.length === 0);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  tenants.unshift({
    id: crypto.randomUUID(),
    name: fields.name.value.trim(),
    rent: fields.rent.value,
    deposit: fields.deposit.value,
    dueDate: fields.dueDate.value,
    note: fields.note.value.trim(),
    paid: fields.paid.checked,
  });

  saveTenants();
  renderTenants();
  form.reset();
  fields.name.focus();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-btn");
  if (!button) return;

  tenants = tenants.filter((tenant) => tenant.id !== button.dataset.id);
  saveTenants();
  renderTenants();
});

clearAll.addEventListener("click", () => {
  if (tenants.length === 0) return;
  if (!confirm("确定要清空所有租客记录吗？")) return;

  tenants = [];
  saveTenants();
  renderTenants();
});

renderTenants();