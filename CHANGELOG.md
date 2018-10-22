## 2.0.1

### Bug Fixes

- Fixes issue with swap upgrade and event subscription left open. Fix allows user to execute swaps more than once.
- Added missing ABI for DBET VET Contract. Allows for `LogGrantTokens` event subscription, which should speed up token swap upgrade considerably.
- Minor fix  to Estimate Gas decimal precision. Issue #56.
