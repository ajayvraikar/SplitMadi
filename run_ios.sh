rm -rf node_modules
rm -rf yarn.lock
npm install    
cd android
./gradlew clean
cd ..
npx react-native run-android