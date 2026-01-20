if [ -d "build_arch" ]; then
    rm -rf build_arch/*
else
    echo "Directory build_arch doesn't exist, creating..."
fi
mkdir -p build_arch
find build -type f | cpio -o > build_arch.cpio && mv build_arch.cpio build_arch/
