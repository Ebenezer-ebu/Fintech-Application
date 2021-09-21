const request = require("supertest");
const app = require("../server.js");

let token;

describe("User API", () => {
  it("should create a new user account", async () => {
    const res = await request(app).post("/apis/v1/user/sign-up").send({
      name: "Ebby2",
      email: "ebby2@gmail.com",
      password: "ebby@demo007",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.email).toEqual("ebby2@gmail.com");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("User created successfully");
  });

  it("Error on creating user with email that already exists", async () => {
    const res = await request(app).post("/apis/v1/user/sign-up").send({
      name: "Ebby2",
      email: "ebby2@gmail.com",
      password: "ebby@demo007",
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toEqual("Email already exists");
  });

  it("It should login a user with password", async () => {
    const res = await request(app).post("/apis/v1/user/login").send({
      email: "ebby2@gmail.com",
      password: "ebby@demo007",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Authentication Successful!");
    token = res.body.token;
  });

  it("It shouldn't login a user with invalid password", async () => {
    const res = await request(app).post("/apis/v1/user/login").send({
      email: "ebby2@gmail.com",
      password: "ebby@demo0079",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Invalid credentials");
  });

  it("should create a new user account", async () => {
    const res = await request(app).post("/apis/v1/user/sign-up").send({
      name: "Ebby4",
      email: "ebby4@gmail.com",
      password: "ebby@demo007",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("User created successfully");
  });

  it("I should be able to create a beneficiary that is a registered user", async () => {
    console.log(token);
    const res = await request(app)
      .post("/apis/v1/add/beneficiary")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "ebby4@gmail.com",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("Beneficiary created successfully");
  });

  it("I shouldn't be able to create a beneficiary that is not a registered user", async () => {
    console.log(token);
    const res = await request(app)
      .post("/apis/v1/add/beneficiary")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "ebby7@gmail.com",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      "No user with that email exists you can't add a beneficiary that is not registered"
    );
  });

  it("I should be able to fund my account", async () => {
    console.log(token);
    const res = await request(app)
      .post("/apis/v1/transfer/fund")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 200,
        description: "Demo check",
        typeOfTransaction: "bank transfer",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("Transaction successful");
    expect(res.body).toHaveProperty("response");
  });
    
    it("I shouldn't be able to send fund to a beneficiary when low in cash", async () => {
      console.log(token);
      const res = await request(app)
        .post("/apis/v1/transfer/send_money")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 600,
          email: "ebby4@gmail.com",
          description: "The Loan",
          typeOfTransaction: "card",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Insufficient Balance");
      expect(res.body).toHaveProperty("balance");
    });

    it("I shouldn't be able to send fund to a beneficiary when low in cash", async () => {
      console.log(token);
      const res = await request(app)
        .post("/apis/v1/transfer/send_money")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 50,
          email: "ebby4@gmail.com",
          description: "The Loan",
          typeOfTransaction: "card",
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual("Transaction successful");
      expect(res.body).toHaveProperty("response");
    });
});
