'use strict'

const assert = require('assert')
const Img = require('../../../lib/nodes/img')
const Commander = require('../../../lib/commander')

describe('Img', function () {
  let commander
  beforeEach(function () {
    commander = new Commander({ type: 'ESC', pageSize: '80' })
  })

  it('should create a img node', function () {
    const img = new Img({
      commander,
      elementName: 'img',
      attributes: { format: 'png' },
      children: 'iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAklEQVR4AewaftIAAASRSURBVO3BUW4jWRIEQfcE73/l2Ab2t56A4lRTUnaYmT+oWmKoWmSoWmSoWmSoWmSoWmSoWuTFF1R+qyRcUTlJwpNUnpSEJ6n8Vkm4MlQtMlQtMlQtMlQtMlQtMlQt8uJNSfhuKj9ZEk5UTpLw3ZLw3VTuGqoWGaoWGaoWGaoWGaoWGaoWefEXqDwlCT+BykkSrqi8Q+WuJHyCypOS8KShapGhapGhapGhapGhapEX/5gknKi8Q+VKEk5UnqRyJQn/kqFqkaFqkaFqkaFqkaFqkaFqkRf/GJV3JOEulScl4USlYKhaZKhaZKhaZKhaZKha5MVfkISfKgknKvW1JPxkQ9UiQ9UiQ9UiQ9UiQ9UiQ9UiL96k8hupnCThROUkCXcl4UTlu6n8RkPVIkPVIkPVIkPVIkPVIkPVIuYP6j9RuZKEE5W7klBfG6oWGaoWGaoWGaoWGaoWefEFlZMk3KVS/5eEE5UrKidJuKJykoS7VE6ScKLypCRcGaoWGaoWGaoWGaoWGaoWGaoWefGFJLxD5a4kPEnlU5KwjcpdKk9Kwl1D1SJD1SJD1SJD1SJD1SJD1SIvvqDyjiTcpXIlCScqJ0l4kspdKp+iciUJJyp3JeFE5SQJd6mcJOHKULXIULXIULXIULXIULXIULXIiy8k4R0qV5JwkoQrKidJOFG5koQTlZMknKhcScI7VK4k4UlJOFF5ksonDFWLDFWLDFWLDFWLDFWLmD94mMqVJDxJ5UlJ+K1UnpSE76ZykoQrQ9UiQ9UiQ9UiQ9UiQ9UiQ9Ui5g8OVD4lCVdUTpJwl8rTknBF5SQJJypPScKTVE6ScJfKSRLuGqoWGaoWGaoWGaoWGaoWGaoWefEXJOGKyonKXSo/WRI+JQlXVE6S8CSVJ6mcJOHKULXIULXIULXIULXIULXIizcl4UTlShJOVK4k4R0qT0rCXSonSThJwl0qV5LwDpW7knCiciUJJyp3DVWLDFWLDFWLDFWLDFWLDFWLvPgglZMk3KVyVxJOVN6hcpfKSRKuqNyl8pOpnCThrqFqkaFqkaFqkaFqkaFqkRdfSMI7kvAJSbhL5SQJT0rCicpdSThRuZKEJ6m8IwlXVJ40VC0yVC0yVC0yVC0yVC0yVC3y4gsqv1US7lJ5RxKuqPxkKidJuEvlJAlXknCicpKEK0PVIkPVIkPVIkPVIkPVIkPVIi/elITvpvKkJJyonKhcScKJyl0qT0rCk5LwpCTcNVQtMlQtMlQtMlQtMlQt8uIvUHlKEup9Kp+icpKEKyrvSMKVoWqRoWqRoWqRoWqRoWqRoWqRF/WfJeGKyjtUriThROUTknCi8t2GqkWGqkWGqkWGqkWGqkWGqkVe/GOScKJykoQTlStJOFE5ScIVlScl4UTlispJEk5UPmGoWmSoWmSoWmSoWmSoWuTFX5CE3ygJT1L5lCTcpbLNULXIULXIULXIULXIULXIULXIizep/EYqJ0k4UfluSThRuZKEdyThLpWTJNylctdQtchQtchQtchQtchQtchQtYj5g6olhqpFhqpFhqpFhqpFhqpF/geVK32gv+OArAAAAABJRU5ErkJggg==',
      parent: null
    })

    assert(img instanceof Img)
  })

  it('should throw validation errors', function () {
    assert.throws(() => {
      return new Img({
        commander,
        elementName: 'img',
        attributes: { },
        children: null,
        parent: null
      })
    })
  })
})
