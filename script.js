const SUPABASE_URL = "https://szvmaaxsaixkhbipdpaz.supabase.co";
const SUPABASE_KEY = "sb_publishable_qMdcNZ7k-VopJsdsye9e8g_SLO-O-DI";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const tenantForm = document.getElementById("tenantForm");
const tenantList = document.getElementById("tenantList");
const emptyState = document.getElementById("emptyState");
const totalCount = document.getElementById("totalCount");
const paidCount = document.getElementById("paidCount");

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
  paidCount.textContent = `${tenants.filter(t => t.paid).length} 已缴租`;

  emptyState.style.display = tenants.length === 0 ? "block" : "none";

  tenants.forEach((tenant) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${tenant.name || ""}</td>
      <td>￥${tenant.rent || 0}</td>
      <td>￥${tenant.deposit || 0}</td>
      <td>${tenant.paid ? "已缴" : "未缴"}</td>
      <td>${tenant.due_date || ""}</td>
      <td>${tenant.note || "无"}</td>
      <td><button onclick="deleteTenant(${tenant.id})">删除</button></td>
    `;

    tenantList.appendChild(row);
  });
}

tenantForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tenant = {
    name: document.getElementById("tenantName").value,
    rent: Number(document.getElementById("rent").value),
    deposit: Number(document.getElementById("deposit").value),
    paid: document.getElementById("paid").checked,
    due_date: document.getElementById("dueDate").value,
    note: document.getElementById("note").value,
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
  loadTenants();
});

async function deleteTenant(id) {
  const { error } = await supabaseClient
    .from("tenants")
    .delete()
    .eq("id", id);

  if (error) {
    alert("删除失败：" + error.message);
    return;
  }

  loadTenants();
}

loadTenants();