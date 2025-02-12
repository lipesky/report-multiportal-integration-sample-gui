# Sample Multiportal Report GUI

A simple application(POC) for extending reporting features of Multi Portal dashboard solution, giving powerful insights. This GUI uses ReactJS

OBS: As it is a POC (proof of concept), there are many points that can be improoved. That will be detailed in "Improvements" section.

## How it works

- User logs in
- Selects a date
- Adjust shift and branch
- Search and/or export result

## Possible improvements
- Fetch branches and shifts, not use hardcoded values
- Move fetch and parse of json to a separate worker
- Change layout of date selection back to date range
- (Some kind of caching in backend to speedup process of exporting after displaying json format)
- More filters
- Custom ordenation 