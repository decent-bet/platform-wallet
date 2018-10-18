const puppeteer = require('puppeteer')

const BASE_URL: string = 'http://localhost:3100/login'

describe('Login', () => {
    beforeAll(async () => {
        ;(global as any).browser = await puppeteer.launch({ headless: true })
    })

    describe('when entering a passphrase and password', () => {
        beforeEach(async () => {
            ;(global as any).page = await browser.newPage()
            await page.goto(BASE_URL)
        })
        
        it('should fail if passphrase is invalid', async () => {
            // Input passphrase
            const passphraseInputId = '#passphraseInput'
            await page.focus(passphraseInputId)
            await page.keyboard.type('somepassphrase')
            let text = await page.$eval(passphraseInputId, (e: any) => e.value)
            expect(text).toContain('somepassphrase')

            // Input password
            const passwordInputId = '#passwordInputId'
            await page.focus(passwordInputId)
            await page.keyboard.type('some super complex password')
            text = await page.$eval(passwordInputId, (e: any) => e.value)
            expect(text).toContain('some super complex password')

            // Input password confirmation
            const passwordConfirmationInputId = '#passwordConfirmationInputId'
            await page.focus(passwordConfirmationInputId)
            await page.keyboard.type('some super complex password')
            text = await page.$eval(
                passwordConfirmationInputId,
                (e: any) => e.value
            )
            expect(text).toContain('some super complex password')

            await page.waitForSelector(passwordConfirmationInputId)

            await page.click('#loginButton')
            await page.waitFor(250)
            const obj = await page.$eval('body', () => document.location.href)
            expect(obj).toBe('http://localhost:3100/login')
        })

        it('should pass if passphrase is invalid', async () => {
            // Input passphrase
            const passphraseInputId = '#passphraseInput'
            const passphrase =
                'middle deliver enjoy can cargo ask story current forum dutch outdoor clown'
            await page.focus(passphraseInputId)
            await page.keyboard.type(passphrase)
            let text = await page.$eval(passphraseInputId, (e: any) => e.value)
            expect(text).toContain(passphrase)

            // Input password
            const passwordInputId = '#passwordInputId'
            await page.focus(passwordInputId)
            await page.keyboard.type('some super complex password')
            text = await page.$eval(passwordInputId, (e: any) => e.value)
            expect(text).toContain('some super complex password')

            // Input password confirmation
            const passwordConfirmationInputId = '#passwordConfirmationInputId'
            await page.focus(passwordConfirmationInputId)
            await page.keyboard.type('some super complex password')
            text = await page.$eval(
                passwordConfirmationInputId,
                (e: any) => e.value
            )
            expect(text).toContain('some super complex password')

            await page.waitForSelector(passwordConfirmationInputId)

            await page.click('#loginButton')
            // const req = await page.waitForRequest('http://localhost:3100/send')
            await page.waitFor(250)
            const obj = await page.$eval('body', () => document.location.href)
            expect(obj).toBe('http://localhost:3100/')
        })
    })
})
