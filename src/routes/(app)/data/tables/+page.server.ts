export async function load() {
  // logic to fetch payments data here
  const payments = await getPayments();
  return {
    payments
  };
}

async function getPayments() {
  // Simulate fetching data from an API or database
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
  ];
}
