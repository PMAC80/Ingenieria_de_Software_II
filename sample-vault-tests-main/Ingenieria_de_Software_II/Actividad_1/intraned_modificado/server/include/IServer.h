#ifndef ISERVER_H
#define ISERVER_H

class IServer {
public:
    virtual ~IServer() = default;
    virtual void iniciar() = 0;
};

// Interfaz para cargar dinámicamente
extern "C" {
#ifdef _WIN32
    __declspec(dllexport) IServer* CreateServerInstance();
#else
    __attribute__((visibility("default"))) IServer* CreateServerInstance();
#endif
}

#endif // ISERVER_H