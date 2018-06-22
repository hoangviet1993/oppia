// Copyright 2017 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for LanguageUtilService
 */

describe('Language util service', function() {
  var lus = null;
  var mockAutogeneratedAudioLanguages = null;
  beforeEach(function() {
    module('oppia', function($provide) {
      mockAutogeneratedAudioLanguages = [{
        id: 'en-auto',
        description: 'English (auto)',
        exploration_language: 'en',
        speech_synthesis_code: 'en-GB',
        speech_synthesis_code_mobile: 'en_US'
      }];
      var mockSupportedAudioLanguages = [{
        id: 'en',
        description: 'English',
        related_languages: ['en']
      }, {
        id: 'hi-en',
        description: 'Hinglish',
        related_languages: ['hi', 'en']
      }, {
        id: 'es',
        description: 'Spanish',
        related_languages: ['es']
      }];
      $provide.constant('AUTOGENERATED_AUDIO_LANGUAGES',
        mockAutogeneratedAudioLanguages);
      $provide.constant('SUPPORTED_AUDIO_LANGUAGES',
        mockSupportedAudioLanguages);
    });
  });

  beforeEach(inject(function($injector) {
    lus = $injector.get('LanguageUtilService');
  }));

  it('should get the correct language count', function() {
    expect(lus.getAudioLanguagesCount()).toEqual(3);
  });

  it('should get the correct description given an audio language code',
    function() {
      expect(lus.getAudioLanguageDescription('en')).toEqual('English');
      expect(lus.getAudioLanguageDescription('hi-en')).toEqual('Hinglish');
      expect(lus.getAudioLanguageDescription('es')).toEqual('Spanish');
    }
  );

  it('should correctly compute the complement languages', function() {
    expect(lus.getComplementAudioLanguageCodes([]))
      .toEqual(['en', 'hi-en', 'es']);
    expect(lus.getComplementAudioLanguageCodes(['en']))
      .toEqual(['hi-en', 'es']);
    expect(lus.getComplementAudioLanguageCodes(['hi-en']))
      .toEqual(['en', 'es']);
    expect(lus.getComplementAudioLanguageCodes(['hi-en', 'en']))
      .toEqual(['es']);
    expect(lus.getComplementAudioLanguageCodes(['abcdefg'])).toEqual([
      'en', 'hi-en', 'es']);
  });

  it('should correctly get related language code given audio language code',
    function() {
      expect(lus.getLanguageCodesRelatedToAudioLanguageCode('en')).
        toEqual(['en']);
      expect(lus.getLanguageCodesRelatedToAudioLanguageCode('hi-en')).
        toEqual(['hi', 'en']);
      expect(lus.getLanguageCodesRelatedToAudioLanguageCode('es')).
        toEqual(['es']);
    });

  it('should correctly check if language supports autogenerated audio',
    function() {
      // Chrome loads voices asynchronously.
      // StackOverflow Issue Reference #: 21513706
      window.speechSynthesis.onvoiceschanged = function() {
        expect(lus.supportsAutogeneratedAudio('hi')).toEqual(false);
        expect(lus.supportsAutogeneratedAudio('en')).toEqual(true);
      };
    });

  it('should correctly check if audio language is autogenerated', function() {
    expect(lus.isAutogeneratedAudioLanguage('en')).toEqual(false);
    expect(lus.isAutogeneratedAudioLanguage('en-auto')).toEqual(true);
  });

  it('should get correct autogenerated audio language with given code',
    function() {
      expect(Object.values(lus.getAutogeneratedAudioLanguage('en'))).toEqual(
        Object.values(mockAutogeneratedAudioLanguages[0]));
    });
});
