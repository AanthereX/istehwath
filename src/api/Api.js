/** @format */

import axios from "axios";
import { getEnvVariable } from "../constants/validate";

class Api {
  constructor() {
    this.baseUrl = getEnvVariable('VITE_APP_BASEURL');
  }

  async _post(endPoint, obj, success, failure) {
    const token = localStorage.getItem("token");
    if (token === null) {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    }
    try {
      let res = await this.instance.post(endPoint, obj);
      if (res) {
        success(res?.data);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
      if (error?.response?.status === 400 || error?.response?.status === 422) {
        failure(
          typeof error?.response?.data?.message === "object"
            ? error?.response?.data?.message[0]
            : error?.response?.data?.response,
        );
        return false;
      }
      if (error) {
        if (error === "Network Error") {
          failure("Network Error");
        } else {
          failure(
            typeof error?.response?.data?.message === "object"
              ? error?.response?.data?.message[0]
              : error?.response?.data?.response,
          );
        }
      }
    }
  }

  async _get(endPoint, success, failure) {
    const token = localStorage.getItem("token");
    if (token === null) {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          Accept: "application/json",
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
    }
    try {
      let res = await this.instance.get(endPoint);
      if (res) {
        success(res?.data);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
      if (error?.response?.status === 400) {
        failure(
          typeof error?.response?.data?.message === "object"
            ? error?.response?.data?.message[0]
            : error?.response?.data?.response,
        );
        return false;
      }
      if (error) {
        console.log("error---", error);
        if (error?.message === "Network Error") {
          // failure("Network Error");
        } else {
          failure(
            typeof error?.response?.data?.message === "object"
              ? error?.response?.data?.message[0]
              : error?.response?.data,
          );
        }
      }
    }
  }

  async _postImage(endPoint, obj, success, failure) {
    const token = localStorage.getItem("token");
    if (token === null) {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });
    }
    try {
      let res = await this.instance.post(endPoint, obj);
      if (res) {
        success(res?.data);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/";
      }
      if (error?.response?.status === 400) {
        failure(
          typeof error?.response?.data?.message === "object"
            ? error?.response?.data?.message[0]
            : error?.response?.data,
        );
        return false;
      }
      if (error) {
        if (error === "Network Error") {
          failure("Network Error");
        } else {
          failure(
            typeof error?.response?.data?.message === "object"
              ? error?.response?.data?.message[0]
              : error?.response?.data,
          );
        }
      }
    }
  }

  async _getWithObj(endPoint, obj, success, failure) {
    const token = localStorage.getItem("token");
    if (token === null) {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          Accept: "application/json",
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
    }
    try {
      let res = await this.instance.get(endPoint, { params: obj });
      if (res) {
        success(res);
      }
    } catch (error) {
      if (error) {
        if (error === "Network Error") {
          failure("Network Error");
        } else {
          failure(
            typeof error?.response?.data?.message === "object"
              ? error?.response?.data?.message[0]
              : error?.response?.data?.message,
          );
        }
      }
    }
  }
  async _patch(endPoint, obj, success, failure) {
    const token = localStorage.getItem("token");
    if (token === null) {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    }
    try {
      let res = await this.instance.patch(endPoint, obj);
      if (res) {
        success(res?.data);
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        failure(
          typeof error?.response?.data?.message === "object"
            ? error?.response?.data?.message[0]
            : error?.response?.data,
        );
        return false;
      }
      if (error) {
        if (error === "Network Error") {
          failure("Network Error");
        } else {
          failure(
            typeof error?.response?.data?.message === "object"
              ? error?.response?.data?.message[0]
              : error?.response?.data,
          );
        }
      }
    }
  }
  async _patchM(endPoint, obj, success, failure) {
    const token = localStorage.getItem("token");
    if (token === null) {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });
    }
    try {
      let res = await this.instance.patch(endPoint, obj);
      if (res) {
        success(res?.data);
      }
    } catch (error) {
      if (error) {
        if (error === "Network Error") {
          failure("Network Error");
        } else {
          failure(
            typeof error?.response?.data?.message === "object"
              ? error?.response?.data?.message[0]
              : error?.response?.data?.message,
          );
        }
      }
    }
  }
  async _delete(endPoint, success, failure) {
    const token = localStorage.getItem("token");
    if (token === null) {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    }
    try {
      let res = await this.instance.delete(endPoint);
      if (res) {
        success(res);
      }
    } catch (error) {
      if (error) {
        if (error === "Network Error") {
          failure("Network Error");
        } else {
          failure(
            typeof error?.response?.data?.message === "object"
              ? error?.response?.data?.message[0]
              : error?.response?.data?.message,
          );
        }
      }
    }
  }
  async _deleteWithObj(endPoint, obj, success, failure) {
    const token = localStorage.getItem("token");
    if (token === null) {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      this.instance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    }
    try {
      let res = await this.instance.delete(endPoint, obj);
      if (res) {
        success(res);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
      if (error) {
        if (error === "Network Error") {
          failure("Network Error");
        } else {
          failure(
            typeof error?.response?.data?.message === "object"
              ? error?.response?.data?.message[0]
              : error?.response?.data?.message,
          );
        }
      }
    }
  }
}

export default new Api();
