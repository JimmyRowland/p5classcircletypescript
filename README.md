# A class coupling visualization

Demo

https://xop4p.csb.app/

https://codesandbox.io/s/nameless-firefly-xop4p

Each circle represents a class. The initial size of the circle is proportional to the number of fields (private variables) and methods (functions) the class has. Each time class A calls a method, it grows bigger. If class A with color A calls a method on class B with color B. Then a small circle B with color B will spawn inside of class A and the small circle B will follow class A. As small circles of color B continue to spawn inside of class A, the force of attraction on class B exerted by class A will increase.

User studies:
https://drive.google.com/file/d/12awbWeHjBtVPKi5wBbgK8tr-rE4wQoDI/view?usp=sharing

![alt text](./src/Screenshotfrom202006130239552.png "Logo Title Text 1")


Refernece: 

https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA

https://codesandbox.io/s/0q4wjnj0jw?file=/index.js:993-1001


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
