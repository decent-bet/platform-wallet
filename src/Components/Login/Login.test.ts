const expectPup = require('expect-puppeteer')

describe('Login', () => {
    const puppeteer = require('puppeteer')

    const BASE_URL: string = 'http://localhost:3100/login'
    
    // IDs for the elements in the page
    const ID_INPUT_PASSWORD = '#passwordInputId'
    const ID_PASSWORD_CONFIRMATION = '#passwordConfirmationInputId'
    const ID_PASSPHRASE_INPUT = '#passphraseInput'

    
    beforeAll(async () => {
        ;(global as any).browser = await puppeteer.launch({ headless: true })
    })

    beforeEach(async () => {
        ;(global as any).page = await browser.newPage()
        await page.goto(BASE_URL)
    })

    afterEach(async () => {
        await page.close()
    })

    test('Password and Password Confirmation should work', async () => {
        // Input Password
        await page.focus(ID_INPUT_PASSWORD)
        await page.keyboard.type('some super complex password')
        const text1 = await page.$eval(ID_INPUT_PASSWORD, (e: any) => e.value)
        expect(text1).toContain('some super complex password')

        // Input password confirmation
        await page.focus(ID_PASSWORD_CONFIRMATION)
        await page.keyboard.type('some super complex password')
        const text2 = await page.$eval(
            ID_PASSWORD_CONFIRMATION,
            (e: any) => e.value
        )
        expect(text2).toContain('some super complex password')

        await page.waitForSelector(ID_PASSWORD_CONFIRMATION)
    })

    describe('Login Flow', () => {
        beforeEach(async () => {
            // Type the password and the confirmation
            const password = 'some super complex password'
            await page.focus(ID_INPUT_PASSWORD)
            await page.keyboard.type(password)
            await page.focus(ID_PASSWORD_CONFIRMATION)
            await page.keyboard.type(password)

            await page.waitForSelector(ID_PASSWORD_CONFIRMATION)
        })

        test('Should fail if passphrase is invalid', async () => {
            // Input passphrase
            await page.focus(ID_PASSPHRASE_INPUT)
            await page.keyboard.type('somepassphrase')
            let text = await page.$eval(
                ID_PASSPHRASE_INPUT,
                (e: any) => e.value
            )
            expect(text).toContain('somepassphrase')

            await expectPup(page).toClick('#loginButton')
            await page.waitFor(250)
            const obj = await page.$eval('body', () => document.location.href)
            expect(obj).toBe('http://localhost:3100/login')
        })

        test('Should pass if passphrase is invalid', async () => {
            // Input passphrase
            const passphrase =
                'middle deliver enjoy can cargo ask story current forum dutch outdoor clown'
            await page.focus(ID_PASSPHRASE_INPUT)
            await page.keyboard.type(passphrase)
            let text = await page.$eval(
                ID_PASSPHRASE_INPUT,
                (e: any) => e.value
            )
            expect(text).toContain(passphrase)

            await expectPup(page).toClick('#loginButton')
            await page.waitFor(250)
            const obj = await page.$eval('body', () => document.location.href)
            expect(obj).toBe('http://localhost:3100/')
        })
    })
})
