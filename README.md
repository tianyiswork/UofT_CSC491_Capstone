# TuneScout

This is the catch all repo for the different features of TuneScout.

## Github Process

This repository will have two main branches: master and integration. Besides these branches, we will have a variety of feature branches that will be created and deleted as required.

Master: This branch is the final destination of any changes we make. Everything in this branch will be available in production and should be bug free.

Integration: This branch is an intermediate branch. Once you've completed a feature, gotten it reviewed and merged it into integration, we can test the app on this branch to make sure it is free of bugs before merging it to our production branch (master).

**Workflow for adding or removing anything to the repository:**
- Create a feature branch, branching off of integration
- Make your changes on this feature branch.
- Remember to have informative commit messages, i.e: "Added unittests for the login functionality" as opposed to "add tests".
- Push your branch up to the remote.
- Create a pull request from your feature branch to integration.
- Send your PR to someone for review.
- Once it is reviewed, merge your branch to integration and then delete the branch.

We will merge integration to master whenever we feel like the integration branch is free of bugs and in a good state to be included in production. 

## Code Review Process
- Ensure feature branch is being merged into integration and not master. 
- If it's a code change: 
  - Review the code line by line.
  - Ensure the code does what it is intended to do. The Pull Request should include a brief description of the goal of the change.
  - Look for any uncaught errors.
  - Ensure the code makes good use of software design principles (S.O.L.I.D) and Design Patterns
  - Check the code for good style.
  - Take TIME! If you're not confident in the code, don't approve it. Ask lots of questions.
  - For more criteria see: https://blog.fogcreek.com/increase-defect-detection-with-our-code-review-checklist-example/
- Once all of these criteria have been met, leave an approval and notify the person that they can merge their change.
- Feel free to reject (request changes) in a pull request if you feel it isn't up to par. It's never personal and is always supposed to maintain a high quality of code.
**Make sure to delete the feature branch after it is done...and don't delete integration!**
