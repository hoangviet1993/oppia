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
 * @fileoverview Unit tests for the Exploration data service.
 */

describe('Exploration data service', function() {
  beforeEach(angular.mock.module('oppia'));

  describe('getData local save', function() {
    var eds = null;
    var mockBackendApiService = null;
    var mockLocalStorageService = null;
    var mockUrlService = null;
    var responseWhenDraftChangesAreValid = null;
    var responseWhenDraftChangesAreInvalid = null;
    var $q = null;

    beforeEach(function() {
      angular.mock.module(function($provide) {
        $provide.value(
          'LocalStorageService', [mockLocalStorageService][0]);
      });
      angular.mock.module(function($provide) {
        $provide.value(
          'EditableExplorationBackendApiService', [mockBackendApiService][0]);
      });
      angular.mock.module(function($provide) {
        $provide.value(
          'UrlService', [mockUrlService][0]);
      });
    });

    beforeEach(function() {
      mockUrlService = {
        getPathname: function() {}
      };

      mockBackendApiService = {
        fetchApplyDraftExploration: function() {}
      };

      mockLocalStorageService = {
        getExplorationDraft: function() {},
        removeExplorationDraft: function() {}
      };
      spyOn(mockUrlService, 'getPathname').and.returnValue('/create/exp_id');
    });

    beforeEach(angular.mock.inject(function($injector) {
      eds = $injector.get('ExplorationDataService');
      $q = $injector.get('$q');
    }));

    beforeEach(function() {
      var expDataResponse = {
        draft_change_list_id: 3,
      };

      responseWhenDraftChangesAreValid = {
        isValid: function() {
          return true;
        },
        getChanges: function() {
          return [];
        }
      };

      responseWhenDraftChangesAreInvalid = {
        isValid: function() {
          return false;
        },
        getChanges: function() {
          return [];
        }
      };

      spyOn(mockBackendApiService, 'fetchApplyDraftExploration').
        and.returnValue($q.when(expDataResponse));
      spyOn(eds, 'autosaveChangeList');
    });


    it('should autosave draft changes when draft ids match', function() {
      var errorCallback = function() {};
      spyOn(mockLocalStorageService, 'getExplorationDraft').
        and.returnValue(responseWhenDraftChangesAreValid);
      eds.getData(errorCallback).then(function(data) {
        expect(eds.autosaveChangeList()).toHaveBeenCalled();
      });
    });

    it('should call error callback when draft ids do not match', function() {
      var errorCallback = function() {};
      spyOn(mockLocalStorageService, 'getExplorationDraft').
        and.returnValue(responseWhenDraftChangesAreInvalid);
      eds.getData(errorCallback).then(function(data) {
        expect(errorCallback()).toHaveBeenCalled();
      });
    });
  });
});
