class CodeGenerator:
    def __init__(self, indentation='\t', code=''):
        self.indentation = indentation
        self.level = 0
        self.code = code

    def indent(self):
        self.level += 1

    def dedent(self):
        if self.level > 0:
            self.level -= 1

    def __add__(self, value):
        temp = CodeGenerator(indentation=self.indentation)
        temp.level = self.level
        temp.code = str(self) + ''.join([self.indentation for i in range(0, self.level)]) + str(value)
        return temp

    def __str__(self):
        return str(self.code)
