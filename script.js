const SUPABASE_URL = "https://szvmaaxsaixkhbipdpaz.supabase.co";
const SUPABASE_KEY = "sb_publishable_qMdcNZ7k-VopJsdsye9e8g_SLO-O-DI";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const tenantForm = document.getElementById("tenantForm");

async function loadTenants() {
  const { data, error } = await supabaseClient
    .from("tenants")
    .select("*");

  console.log(data);

  if (error) {
    console.error(error);
  }
}

tenantForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tenant = {
    name: document.getElementById("name").value,
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
    console.error(error);
    alert("添加失败");
    return;
  }

  alert("添加成功");

  tenantForm.reset();

  loadTenants();
});

loadTenants();