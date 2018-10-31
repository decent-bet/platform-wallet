## 2.0.2

### Maintenance

- Upgrade to Node 10
- Upgrade to Electron 3
- Upgrade to Material UI 3.3.2

## 2.0.1

### Bug Fixes

- Fixes issue with swap upgrade and event subscription left open. Fix allows user to execute swaps more than once.
- Added missing ABI for DBET VET Contract. Allows for `LogGrantTokens` event subscription, which should speed up token swap upgrade considerably.
- Minor fix  to Estimate Gas decimal precision. Issue https://github.com/decent-bet/platform-wallet/issues/56.
