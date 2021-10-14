exports.seed = (knex) => {
  return knex('users')
    .count('id as cnt')
    .then((rows) => {
      const cnt = rows[0].cnt;

      if (cnt) {
        return;
      }

      return knex('users')
        .insert(
          [
            {
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              full_name: 'Test user',
              email: 'user@mail.com',
              password: '$2b$12$gXV9Wd235KDMp8SwoeGca.Ttqs4CVaaCso0hV/t2SB5Z7DnSjRm02', // Test12345_
              role: 'USER'
            },
            {
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              full_name: 'Test admin',
              email: 'admin@mail.com',
              password: '$2b$12$gXV9Wd235KDMp8SwoeGca.Ttqs4CVaaCso0hV/t2SB5Z7DnSjRm02', // Test12345_
              role: 'USER_MANAGER'
            }
          ]
        );
    });
};
