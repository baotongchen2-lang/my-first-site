const SUPABASE_URL = "https://szvmaaxsaixkhbipdpaz.supabase.co";
const SUPABASE_KEY = "sb_publishable_qMdcNZ7k-VopJsdsye9e8g_SLO-O-DI";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const tenantForm = document.getElementById("tenantForm");
const tenantList = document.getElementById("tenantList");
const emptyState = document.getElementById("emptyState");
const totalCount = document.getElementById("totalCount");
const paidCount = document.getElementById("paidCount");
const clearAllButton = document.getElementById("clearAll");

async function loadTenants() {
  const { data, error } = await supabaseClient
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("读取失败：", error);
    alert("读取数据库失败：" + error.message);
    return;
  }

  renderTenants(data || []);
}

function renderTenants(tenants) {
  tenantList.innerHTML = "";

  totalCount.textContent = `${tenants.length} 位租客`;
  paidCount.textContent = `${tenants.filter((tenant) => tenant.paid).length} 已缴租`;

  emptyState.style.display = tenants.length === 0 ? "block" : "none";

  tenants.forEach((tenant) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHTML(tenant.name || "")}</td>
      <td>￥${Number(tenant.rent || 0).toLocaleString()}</td>
      <td>￥${Number(tenant.deposit || 0).toLocaleString()}</td>
      <td>
        <span class="${tenant.paid ? "paid" : "unpaid"}">
          ${tenant.paid ? "已缴" : "未缴"}
        </span>
      </td>
      <td>${escapeHTML(tenant.due_date || "")}</td>
      <td>${escapeHTML(tenant.note || "无")}</td>
      <td>
        <button class="danger" type="button" onclick="deleteTenant(${tenant.id})">
          删除
        </button>
      </td>
    `;

    tenantList.appendChild(row);
  });
}

tenantForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const tenant = {
    name: document.getElementById("tenantName").value.trim(),
    rent: Number(document.getElementById("rentAmount").value),
    deposit: Number(document.getElementById("depositAmount").value),
    paid: document.getElementById("isPaid").checked,
    due_date: document.getElementById("dueDate").value,
    note: document.getElementById("damageNote").value.trim(),
  };

  const { error } = await supabaseClient
    .from("tenants")
    .insert([tenant]);

  if (error) {
    console.error("添加失败：", error);
    alert("添加失败：" + error.message);
    return;
  }

  alert("添加成功");
  tenantForm.reset();
  await loadTenants();
});

async function deleteTenant(id) {
  const confirmDelete = confirm("确定要删除这条租客记录吗？");

  if (!confirmDelete) return;

  const { error } = await supabaseClient
    .from("tenants")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("删除失败：", error);
    alert("删除失败：" + error.message);
    return;
  }

  await loadTenants();
}

clearAllButton.addEventListener("click", async () => {
  const confirmClear = confirm("确定要清空所有租客记录吗？");

  if (!confirmClear) return;

  const { error } = await supabaseClient
    .from("tenants")
    .delete()
    .neq("id", 0);

  if (error) {
    console.error("清空失败：", error);
    alert("清空失败：" + error.message);
    return;
  }

  await loadTenants();
});

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadTenants();