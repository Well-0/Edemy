#include <QApplication>
#include <QWidget>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QLabel>
#include <QPushButton>
#include <QFont>

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);
    
    QWidget window;
    window.setWindowTitle("Learning Platform");
    window.setMinimumSize(800, 600);
    window.setStyleSheet("QWidget { background-color: #f5f5f5; }");
    
    QVBoxLayout *mainLayout = new QVBoxLayout(&window);
    mainLayout->setContentsMargins(50, 50, 50, 50);
    mainLayout->setSpacing(30);
    
    // Welcome title
    QLabel *title = new QLabel("Welcome to Your Learning Platform");
    QFont titleFont;
    titleFont.setPointSize(32);
    titleFont.setBold(true);
    title->setFont(titleFont);
    title->setStyleSheet("QLabel { color: #2c3e50; }");
    title->setAlignment(Qt::AlignCenter);
    
    // Subtitle
    QLabel *subtitle = new QLabel("Start your journey to mastering new skills");
    QFont subtitleFont;
    subtitleFont.setPointSize(16);
    subtitle->setFont(subtitleFont);
    subtitle->setStyleSheet("QLabel { color: #7f8c8d; }");
    subtitle->setAlignment(Qt::AlignCenter);
    
    // Spacer
    mainLayout->addStretch();
    mainLayout->addWidget(title);
    mainLayout->addWidget(subtitle);
    mainLayout->addSpacing(40);
    
    // Buttons layout
    QHBoxLayout *buttonLayout = new QHBoxLayout();
    buttonLayout->setSpacing(20);
    
    QPushButton *getStartedBtn = new QPushButton("Get Started");
    getStartedBtn->setMinimumSize(150, 50);
    getStartedBtn->setStyleSheet(
        "QPushButton {"
        "   background-color: #3498db;"
        "   color: white;"
        "   border: none;"
        "   border-radius: 5px;"
        "   font-size: 16px;"
        "   font-weight: bold;"
        "}"
        "QPushButton:hover {"
        "   background-color: #2980b9;"
        "}"
    );
    
    QPushButton *browseLessonsBtn = new QPushButton("Browse Lessons");
    browseLessonsBtn->setMinimumSize(150, 50);
    browseLessonsBtn->setStyleSheet(
        "QPushButton {"
        "   background-color: #2ecc71;"
        "   color: white;"
        "   border: none;"
        "   border-radius: 5px;"
        "   font-size: 16px;"
        "   font-weight: bold;"
        "}"
        "QPushButton:hover {"
        "   background-color: #27ae60;"
        "}"
    );
    
    buttonLayout->addStretch();
    buttonLayout->addWidget(getStartedBtn);
    buttonLayout->addWidget(browseLessonsBtn);
    buttonLayout->addStretch();
    
    mainLayout->addLayout(buttonLayout);
    mainLayout->addStretch();
    
    window.show();
    return app.exec();
}