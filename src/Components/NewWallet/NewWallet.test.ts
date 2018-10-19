describe('NewWallet', () => {
    const puppeteer = require('puppeteer')

    const BASE_URL: string = 'http://localhost:3100/new_wallet'

    // IDs for the elements in the page
    const ID_MNEMONIC_INPUT = '#mnemonicInput'
    const ID_MNEMONIC_INPUT2 = '#mnemonicInput2'
    const ID_PASSWORD_INPUT = '#passwordInput'
    const ID_PASSWORD_CONFIRMATION_INPUT = '#passwordConfirmationInput'

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

    describe('when creating a new wallet', () => {
        test('should display 12 words mnemonic', async () => {
            // Input passphrase
            await page.focus(ID_MNEMONIC_INPUT)
            let text = await page.$eval(ID_MNEMONIC_INPUT, (e: any) => e.value)
            expect(text.split(' ').length).toBe(12)
        })
    })

    describe('when creating a new wallet and click on next', () => {
        let mnemonic
        beforeEach(async () => {
            await page.focus(ID_MNEMONIC_INPUT)
            mnemonic = await page.$eval(ID_MNEMONIC_INPUT, (e: any) => e.value)

            const svg = await page.$("svg[data-icon='arrow-right']")
            if (svg) {
                const span = await svg.getProperty('parentNode')
                const btn = await span.getProperty('parentNode')
                await (btn as any).click()
            }
        })

        test('should ask me for mnemonic confirmation and session  password', async () => {

            // Input password
            let password = 'sessi0np@$$'
            await page.focus(ID_PASSWORD_INPUT)
            await page.keyboard.type(password)
            let text = await page.$eval(ID_PASSWORD_INPUT, (e: any) => e.value)
            expect(text).toBe(password)

            // Input password confirmation
            await page.focus(ID_PASSWORD_CONFIRMATION_INPUT)
            await page.keyboard.type(password)
            text = await page.$eval(
                ID_PASSWORD_CONFIRMATION_INPUT,
                (e: any) => e.value
            )
            expect(text).toBe(password)

            // Input passphrase
            await page.focus(ID_MNEMONIC_INPUT2)
            await page.keyboard.type(mnemonic)
            text = await page.$eval(ID_MNEMONIC_INPUT2, (e: any) => e.value)
            expect(text.split(' ').length).toBe(12)

            const el = await page.$(
                `${ID_MNEMONIC_INPUT2}-helper-text`
            )
            expect(el).toBeNull()
        })
        test('should display bad passphrase message', async () => {

            // Input password
            let password = 'sessi0np@$$'
            await page.focus(ID_PASSWORD_INPUT)
            await page.keyboard.type(password)
            let text = await page.$eval(ID_PASSWORD_INPUT, (e: any) => e.value)
            expect(text).toBe(password)

            // Input password confirmation
            await page.focus(ID_PASSWORD_CONFIRMATION_INPUT)
            await page.keyboard.type(password)
            text = await page.$eval(
                ID_PASSWORD_CONFIRMATION_INPUT,
                (e: any) => e.value
            )
            expect(text).toBe(password)

            let passphrase =
                'middle deliver enjoy can cargo ask story current forum dutch outdoor clown'

            // Input passphrase
            await page.focus(ID_MNEMONIC_INPUT2)
            await page.keyboard.type(passphrase)
            text = await page.$eval(ID_MNEMONIC_INPUT2, (e: any) => e.value)
            expect(text.split(' ').length).toBe(12)

            text = await page.$eval(
                `${ID_MNEMONIC_INPUT2}-helper-text`,
                (e: any) => e.innerText
            )
            expect(text).toContain('Invalid passphrase')
        })
    })
})
