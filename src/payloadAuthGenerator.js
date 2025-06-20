const accountsPermissions = {
  A: ["member_eligibility", "view_member_accum", "view_eob"],
  B: ["member_eligibility", "view_eob"],
};

const rolePermissions = {
  client_admin: [
    "view_eob",
    "perform_enrollment",
    "view_claims",
    "member_search",
  ],
  client_user: ["view_eob", "member_search"],
};

const user = {
  accounts: ["A", "B", "C"],
  role: "client_admin",
};

function generatePayload(user) {
  const payload = {};

  // 1. Coletar todas as permissões para o 'default'
  const allPermissions = new Set();
  user.accounts.forEach((account) => {
    accountsPermissions[account]?.forEach((perm) => allPermissions.add(perm));
  });
  rolePermissions[user.role]?.forEach((perm) => allPermissions.add(perm));

  // 2. Inicializar o payload com o 'default'
  payload.default = Array.from(allPermissions);

  // 3. Mapear permissões por conta
  const accountPermissions = {};
  user.accounts.forEach((account) => {
    accountPermissions[account] = accountsPermissions[account] || [];
  });

  // 4. Agrupar contas com base em cada permissão individualmente
  const groupedAccounts = {};
  Object.keys(accountPermissions).forEach((account) => {
    accountPermissions[account].forEach((perm) => {
      if (!groupedAccounts[perm]) {
        groupedAccounts[perm] = [];
      }
      groupedAccounts[perm].push(account);
    });
  });

  // 5. Criar as chaves combinadas e adicionar ao payload
  Object.keys(groupedAccounts).forEach((permission) => {
    const accounts = groupedAccounts[permission];

    if (accounts.length > 1) {
      const accountsKey = accounts.sort().join(",");
      if (!payload[accountsKey]) {
        payload[accountsKey] = [];
      }
      payload[accountsKey].push(permission);
    } else {
      if (!payload[accounts[0]]) {
        payload[accounts[0]] = [];
      }
      payload[accounts[0]].push(permission);
    }
  });

  return payload;
}

const finalPayload = generatePayload(user);
console.log(JSON.stringify(finalPayload, null, 2));
