// Copyright 2014 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utilities for user creation, login and privileging when
 * carrying out end-to-end testing with protractor.
 */

var forms = require('./forms.js');
var general = require('./general.js');
var waitFor = require('./waitFor.js');

var AdminPage = require('../protractor_utils/AdminPage.js');
var adminPage = new AdminPage.AdminPage();

var loginButton = element(by.css('[ng-if="!username"]'));
var driver = browser.driver;

var loginPageLoaded = function() {
  // Waiting for url to change.
  var loginUrl = 'http://localhost:9001/_ah/login?continue=http%3A//localhost%3A9001/signup%3Freturn_url%3D%252F';
  return driver.getCurrentUrl().then(function(currentUrl) {
    return currentUrl === loginUrl;
  });
};

var login = function(email, isSuperAdmin) {
  // User need to be logged out before logging in a new account.
  browser.get(general.SERVER_URL_PREFIX);
  waitFor.pageToFullyLoad();
  waitFor.elementToBeClickable(loginButton, 'Login button is not clickable');
  loginButton.click();

  // Use of element is not possible because the login page is non-angular.
  // The full url is also necessary.
  browser.wait(loginPageLoaded, 10000, 'Login page takes too long to be ready');
  driver.findElement(protractor.By.name('email')).clear();
  driver.findElement(protractor.By.name('email')).sendKeys(email);
  if (isSuperAdmin) {
    driver.findElement(protractor.By.name('admin')).click();
  }
  driver.findElement(protractor.By.id('submit-login')).click();
  waitFor.pageToFullyLoad();
};

var logout = function() {
  browser.get(general.SERVER_URL_PREFIX);
  waitFor.pageToFullyLoad();
  var profileDropdown = element(by.css('.protractor-test-profile-dropdown'));
  profileDropdown.click();
  var logoutButton = element(by.css('[ng-href="/logout?return_url=%2F"]'));
  waitFor.elementToBeClickable(logoutButton, 'Logout button is not clickable');
  logoutButton.click();
  // Wait for splash page to load.
  waitFor.pageToFullyLoad();
  waitFor.elementToBeClickable(
    loginButton, 'Login button is expected to be clickable after logging out ');
};

// The user needs to log in immediately before this method is called. Note
// that this will fail if the user already has a username.
var _completeSignup = function(username) {
  browser.get('/signup?return_url=http%3A%2F%2Flocalhost%3A9001%2F');
  waitFor.pageToFullyLoad();
  var usernameInput = element(by.css('.protractor-test-username-input'));
  var agreeToTermsCheckbox = element(
    by.css('.protractor-test-agree-to-terms-checkbox'));
  var registerUser = element(by.css('.protractor-test-register-user'));
  waitFor.visibilityOf(usernameInput, 'No username input field was displayed');
  usernameInput.sendKeys(username);
  agreeToTermsCheckbox.click();
  registerUser.click();
  waitFor.pageToFullyLoad();
};

var createUser = function(email, username) {
  createAndLoginUser(email, username);
  logout();
};

var createAndLoginUser = function(email, username) {
  login(email);
  _completeSignup(username);
};

var createModerator = function(email, username) {
  login(email, true);
  _completeSignup(username);
  adminPage.get();
  adminPage.updateRole(username, 'moderator');
  logout();
};

var createAdmin = function(email, username) {
  createAndLoginAdminUser(email, username);
  logout();
};

var createAndLoginAdminUser = function(email, username) {
  login(email, true);
  _completeSignup(username);
  adminPage.get();
  adminPage.updateRole(username, 'admin');
};

exports.login = login;
exports.logout = logout;
exports.createUser = createUser;
exports.createAndLoginUser = createAndLoginUser;
exports.createModerator = createModerator;
exports.createAdmin = createAdmin;
exports.createAndLoginAdminUser = createAndLoginAdminUser;
