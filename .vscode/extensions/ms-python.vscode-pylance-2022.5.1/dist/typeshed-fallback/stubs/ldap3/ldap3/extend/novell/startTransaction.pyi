from typing import Any

from ...extend.operation import ExtendedOperation

class StartTransaction(ExtendedOperation):
    request_name: str
    response_name: str
    request_value: Any
    asn1_spec: Any
    def config(self) -> None: ...
    def __init__(self, connection, controls: Any | None = ...) -> None: ...
    def populate_result(self) -> None: ...
    response_value: Any
    def set_response(self) -> None: ...
