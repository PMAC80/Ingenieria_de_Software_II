#include "include/IServer.h"
#include "include/httplib.h"
#include "include/json.hpp"
#include "utils/fileHelper.cpp"
#include <iostream>
#include <fstream>
#include <sys/stat.h>

using json = nlohmann::json;

void asegurar_directorio(const std::string& path) {
    struct stat info;
    if (stat(path.c_str(), &info) != 0) {
        #ifdef _WIN32
            mkdir(path.c_str());
        #else
            mkdir(path.c_str(), 0777);
        #endif
    }
}

class ServerImpl : public IServer {
    httplib::Server svr;
    const std::string ADMIN_TOKEN = "educacion_libre_2026";
    const std::string upload_dir = "./server/uploads";

public:
    ServerImpl() {
        asegurar_directorio(upload_dir);
        
        svr.set_mount_point("/", "./public");
        svr.set_mount_point("/recursos", upload_dir);

        svr.Post("/api/login", [this](const httplib::Request &req, httplib::Response &res) {
            try {
                auto j_input = json::parse(req.body);
                if (j_input["password"] == "admin123") {
                    res.set_content("{\"token\": \"" + ADMIN_TOKEN + "\"}", "application/json");
                } else {
                    res.status = 401;
                    res.set_content("{\"error\": \"No autorizado\"}", "application/json");
                }
            } catch (...) {
                res.status = 400;
                res.set_content("{\"error\": \"JSON invalido\"}", "application/json");
            }
        });

        svr.Get("/api/contenidos", [this](const httplib::Request &, httplib::Response &res) {
            std::ifstream file(upload_dir + "/metadata.json");
            if (file.is_open()) {
                json db;
                file >> db;
                res.set_content(db.dump(), "application/json");
            } else {
                res.set_content("{\"contenidos\": []}", "application/json");
            }
        });

        svr.Post("/api/upload", [this](const httplib::Request &req, httplib::Response &res) {
            if (req.get_header_value("Authorization") != ADMIN_TOKEN) {
                res.status = 403;
                res.set_content("{\"error\": \"Token invalido\"}", "application/json");
                return;
            }
            if (!req.form.has_file("archivo")) {
                res.status = 400;
                res.set_content("{\"error\": \"Falta el archivo\"}", "application/json");
                return;
            }

            const auto &file_part = req.form.get_file("archivo");
            std::string path = upload_dir + "/" + file_part.filename;
            std::ofstream ofs(path, std::ios::binary);
            
            if (ofs.is_open()) {
                ofs << file_part.content;
                ofs.close();
                json nuevo = {
                    {"titulo", req.form.get_field("titulo")},
                    {"autor", req.form.get_field("autor")},
                    {"tema", req.form.get_field("tema")},
                    {"file", file_part.filename}
                };
                if (FileHelper::registrarArchivo(nuevo)) {
                    res.set_content("{\"status\": \"success\"}", "application/json");
                } else {
                    res.status = 500;
                    res.set_content("{\"error\": \"Error en metadata\"}", "application/json");
                }
            } else {
                res.status = 500;
                res.set_content("{\"error\": \"Error E/S\"}", "application/json");
            }
        });
    }

    void iniciar() override {
        std::cout << "Servidor iniciado en http://localhost:8080 (Modo compatibilidad POSIX con DLL/SO)" << std::endl;
        svr.listen("0.0.0.0", 8080);
    }
};

extern "C" {
#ifdef _WIN32
    __declspec(dllexport) IServer* CreateServerInstance() { return new ServerImpl(); }
#else
    __attribute__((visibility("default"))) IServer* CreateServerInstance() { return new ServerImpl(); }
#endif
}