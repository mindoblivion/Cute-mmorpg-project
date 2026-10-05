plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.aistudio.dungeonquest"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.aistudio.dungeonquest"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }

    sourceSets {
        getByName("main") {
            assets.srcDirs("../web/dist")
        }
    }
}

val buildWeb = tasks.register<Exec>("buildWeb") {
    workingDir = rootProject.projectDir
    commandLine("sh", "-c", "if [ ! -d web/node_modules ]; then npm install --prefix web; fi && npm run build --prefix web")
}
tasks.named("preBuild") {
    dependsOn(buildWeb)
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.webkit:webkit:1.10.0")
}
