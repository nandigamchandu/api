'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ax = _interopDefault(require('axios'));
var ioTsPromise = require('io-ts-promise');
var queryString = require('query-string');
var technoidentityUtils = require('technoidentity-utils');
var immer = require('immer');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function slashWarn(s) {
  technoidentityUtils.verify(technoidentityUtils.string.is(s));
  technoidentityUtils.debug(!s.includes('/'), s + " should not contain \"/\"");
}

function buildResource(resource) {
  if (resource !== undefined && resource.trim() !== '') {
    slashWarn(resource);
    return "/" + resource;
  }

  return '';
}

function buildPath(path) {
  if (technoidentityUtils.array(technoidentityUtils.string).is(path)) {
    var paths = path.filter(function (p) {
      return p.trim() !== '';
    });
    paths.forEach(slashWarn);
    return paths.length === 0 ? '' : "/" + paths.join('/');
  }

  if (technoidentityUtils.string.is(path) && path.trim() !== '') {
    slashWarn(path);
    return "/" + path;
  }

  return '';
}

function buildQueryString(query) {
  return query === undefined || technoidentityUtils.keys(query).length === 0 ? '' : "?" + (technoidentityUtils.string.is(query) ? query : queryString.stringify(query));
}

function buildUrl(options) {
  return "" + buildResource(options.resource) + buildPath(options.path) + buildQueryString(options.query);
}

function url(options) {
  return technoidentityUtils.string.is(options) ? options : buildUrl(options);
} // tslint:disable-next-line: typedef


function http(_ref) {
  var del = function del(options) {
    try {
      return Promise.resolve(axios["delete"](url(options)));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var put = function put(options, data, responseSpec) {
    try {
      return Promise.resolve(axios.put(url(options), data).then(function (res) {
        return res.data;
      }).then(ioTsPromise.decode(responseSpec)));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var patch = function patch(options, data, responseSpec) {
    try {
      return Promise.resolve(axios.patch(url(options), data).then(function (res) {
        return res.data;
      }).then(ioTsPromise.decode(responseSpec)));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var post = function post(options, data, responseSpec) {
    try {
      return Promise.resolve(axios.post(url(options), data).then(function (res) {
        return res.data;
      }).then(ioTsPromise.decode(responseSpec)));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var get = function get(options, responseSpec) {
    try {
      return Promise.resolve(axios.get(url(options)).then(function (res) {
        return res.data;
      }).then(ioTsPromise.decode(responseSpec)));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var baseURL = _ref.baseURL,
      config = _objectWithoutPropertiesLoose(_ref, ["baseURL"]);

  var axios = ax.create(_extends({}, config, {
    baseURL: technoidentityUtils.chop(baseURL)
  }));
  return {
    get: get,
    del: del,
    put: put,
    post: post,
    patch: patch,
    axios: axios
  };
}

var Page =
/*#__PURE__*/
technoidentityUtils.req({
  current: technoidentityUtils.number,
  limit: technoidentityUtils.number
});
var SliceStartEnd =
/*#__PURE__*/
technoidentityUtils.req({
  start: technoidentityUtils.number,
  end: technoidentityUtils.number
});
var SliceStartLimit =
/*#__PURE__*/
technoidentityUtils.req({
  start: technoidentityUtils.number,
  limit: technoidentityUtils.number
});
var Slice =
/*#__PURE__*/
technoidentityUtils.union([SliceStartEnd, SliceStartLimit]);

function apiQuerySpec(codec) {
  var props = technoidentityUtils.getProps(codec);
  return technoidentityUtils.opt({
    select: technoidentityUtils.readonlyArray(technoidentityUtils.keyof(props)),
    filter: technoidentityUtils.partial(props),
    range: technoidentityUtils.union([Page, Slice]),
    asc: technoidentityUtils.readonlyArray(technoidentityUtils.keyof(props)),
    desc: technoidentityUtils.readonlyArray(technoidentityUtils.keyof(props)),
    fullText: technoidentityUtils.string,
    like: technoidentityUtils.partial(props),
    // operators: record(keys(codec), Operators),
    embed: technoidentityUtils.keyof(props)
  });
}

function likeQuery(like) {
  var obj = like || {};
  return Object.keys(obj).reduce(function (acc, k) {
    // tslint:disable-next-line: no-object-mutation
    acc[k + "_like"] = obj[k];
    return acc;
  }, {});
}

function toJSONServerQuery(codec, query) {
  technoidentityUtils.cast(apiQuerySpec(codec), query);
  var range = Page.is(query.range) ? {
    _page: query.range.current,
    _limit: query.range.limit
  } : SliceStartEnd.is(query.range) ? {
    _start: query.range.start,
    _end: query.range.end
  } : SliceStartLimit.is(query.range) ? {
    _start: query.range.start,
    _limit: query.range.limit
  } : {};
  var asc = query.asc,
      desc = query.desc;

  var _sort = (asc || []).concat(desc || []);

  var _order = (asc || []).map(function (_) {
    return 'asc';
  }).concat((desc || []).map(function (_) {
    return 'desc';
  }));

  var filter = query.filter,
      q = query.fullText,
      embed = query.embed;
  return queryString.stringify(_extends({}, likeQuery(query.like), {}, filter, {}, range, {
    _sort: _sort,
    _order: _order,
    q: q,
    embed: embed
  }), {
    arrayFormat: 'comma'
  });
}
function toAPIQuery(spec, query) {
  technoidentityUtils.cast(apiQuerySpec(spec), query);
  var asc = query.asc,
      desc = query.desc;
  var filter = query.filter,
      q = query.fullText,
      embed = query.embed,
      select = query.select;
  return queryString.stringify(_extends({}, filter, {}, query.range || {}, {
    select: select,
    asc: asc,
    desc: desc,
    q: q,
    embed: embed
  }, likeQuery(query.like)), {
    arrayFormat: 'comma'
  });
}

function appendId(options, id) {
  return immer.produce(options, function (draft) {
    if (draft.path === undefined) {
      draft.path = id;
    } else if (technoidentityUtils.UnknownArray.is(draft.path)) {
      draft.path.unshift(id);
    } else {
      draft.path = [id, draft.path];
    }
  });
}

function rest(spec, idKey, _ref, toQuery) {
  var update = function update(id, data, options) {
    try {
      return Promise.resolve(http$1.patch(appendId(_extends({}, options, {
        resource: resource
      }), id), data, spec));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var replace = function replace(id, data, options) {
    try {
      return Promise.resolve(http$1.put(appendId(_extends({}, options, {
        resource: resource
      }), id), data, spec));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var select = function select(query, _select, options) {
    try {
      return Promise.resolve(http$1.get(_extends({
        query: toQuery(spec, _extends({}, query, {
          select: _select
        }))
      }, options, {
        resource: resource
      }), technoidentityUtils.readonlyArray(technoidentityUtils.objPick(spec, _select))));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var list = function list(query, options) {
    try {
      return many(_extends({
        query: toQuery(spec, query)
      }, options));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var get = function get(id, options) {
    try {
      return one(appendId(_extends({}, options, {
        resource: resource
      }), id));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var del = function del(id, options) {
    try {
      return Promise.resolve(http$1.del(appendId(_extends({}, options, {
        resource: resource
      }), id)));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var create = function create(data, options) {
    try {
      // @TODO: Hopefully in future, either we won't omit, or use spec to omit.
      return Promise.resolve(http$1.post(_extends({}, options, {
        resource: resource
      }), technoidentityUtils.omit(data, [idKey]), spec));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var one = function one(options) {
    try {
      return Promise.resolve(http$1.get(_extends({}, options, {
        resource: resource
      }), spec));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var many = function many(options) {
    try {
      return Promise.resolve(http$1.get(_extends({}, options, {
        resource: resource
      }), technoidentityUtils.readonlyArray(spec)));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var resource = _ref.resource,
      options = _objectWithoutPropertiesLoose(_ref, ["resource"]);

  if (toQuery === void 0) {
    toQuery = toAPIQuery;
  }

  var http$1 = http(options);
  return {
    one: one,
    many: many,
    replace: replace,
    update: update,
    create: create,
    del: del,
    get: get,
    list: list,
    idKey: idKey,
    spec: spec,
    resource: resource,
    http: http$1,
    select: select
  };
}

exports.Page = Page;
exports.Slice = Slice;
exports.buildUrl = buildUrl;
exports.http = http;
exports.rest = rest;
exports.toAPIQuery = toAPIQuery;
exports.toJSONServerQuery = toJSONServerQuery;
//# sourceMappingURL=devfractal-api.cjs.development.js.map
