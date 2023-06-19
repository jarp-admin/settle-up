# Settle-up

Your Discord Accountant Bot (DAB)

# Contributing

To work on this repo, first clone a local copy of it. To finish setting up the local dev environment, run the setup.ps1 script; This will check if you have a few non-npm related dependencies correctly configured (namely psql), and then run `npm i` for all the workspaces. You can do this yourself if you prefer.

If you do decide to do it for yourself, note that setup also creates a separate database called `settleup` in psql; this ensure you wont have any collisions with other projects. Make sure to do this step yourself too.

Env variables in a monorepo are a nightmare; we have gotten around the problem by placing a single .env file in the root directory (the same directory as this readme) and then symlinking it to the requisite folder locations. The linkEnv script will do this for you.
