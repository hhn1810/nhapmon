const rewire = require("rewire")
const UserController = rewire("./UserController")
const UserControllers = UserController.__get__("UserControllers")
// @ponicode
describe("inst.updateEmail", () => {
    let inst

    beforeEach(() => {
        inst = new UserControllers()
    })

    test("0", async () => {
        await inst.updateEmail({ body: { email: "user@ponicode.co.uk" }, params: { id: "myDIV" } }, 404)
    })

    test("1", async () => {
        await inst.updateEmail({ body: { email: "user.ponicode.com" }, params: { id: "ponicodecom" } }, 400)
    })

    test("2", async () => {
        await inst.updateEmail({ body: { email: "user@ponicode.com" }, params: { id: "ponicodecom" } }, 200)
    })
})
