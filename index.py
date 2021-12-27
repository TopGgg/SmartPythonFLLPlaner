from flask import Flask, send_from_directory, request, render_template_string, session
import json
import math

import utils
from codeGenerator import CodeGenerator
from flask_session import Session

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.route("/")
def main():
    if not session.get("diameter"):
        session["diameter"] = "80"
        session["track"] = "121"
    return send_from_directory('static', 'index.html')


@app.route("/updateProperties", methods=["POST"])
def updateProperties():
    data = json.loads(request.get_data())
    print(data)
    session["diameter"] = str(data[0])
    session["track"] = str(data[1])
    return "ok"


@app.route("/getProperties", methods=["GET"])
def getProperties():
    return json.dumps([session["diameter"], session["track"]])


@app.route("/generatePython", methods=['POST'])
def generatePython():
    lines = json.loads(request.get_data())
    print(lines)
    template = render_template_string(open("templates\\basicTemplate.pyt", 'r').read(),
                                      wheel_diameter=session["diameter"],
                                      axle_track=session["track"])
    generator = CodeGenerator(indentation="    ", code=template)
    for index, line in enumerate(lines):
        startX = (((line[0] / 1600) * 100) / 100) * 200
        startY = (((line[1] / 750) * 100) / 100) * 120
        endX = (((line[2] / 1600) * 100) / 100) * 200
        endY = ((line[3] / 750) * 100) / 100 * 120
        distance = round(math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2), 3)
        # 1600px X 750px
        # 200cm X 120cm
        distanceTemplate = "\n" + render_template_string(open("templates\\straightTemplate.pyt", 'r').read(),
                                                         distance=distance)
        generator += distanceTemplate
        if index + 1 < len(lines):
            nextLine = lines[index + 1]
            thisDegrees = utils.AngleBtw2Points((line[0], line[1]), (line[2], line[3]))
            nextDegrees = utils.AngleBtw2Points((nextLine[0], nextLine[1]), (nextLine[2], nextLine[3]))
            if abs(abs(thisDegrees) - abs(nextDegrees)) > 8:
                generator += "\n" + render_template_string(open("templates\\turnTemplate.pyt", 'r').read(),
                                                           degrees=round(nextDegrees - thisDegrees, 3))
    return str(generator)
